import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import {Observable} from 'rxjs';
import {User} from '../../../../core/user/user.types';
import {Option} from '../../../../core/option/option.types';
import {UserService} from '../../../../core/user/user.service';
import {ImprintService} from '../../../../core/imprint/imprint.service';
import {InstitutionService} from '../../../../core/institution/institution.service';
import {ExamService} from '../../../../core/exam/exam.service';
import {OptionService} from '../../../../core/option/option.service';
import {Router} from '@angular/router';
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatStepperModule} from "@angular/material/stepper";
import {StateService} from "../state.service";
import {AnswerService} from "../../../../core/answer/answer.service";

interface SurveyQuestion {
    _id: string;
    question: string;
    response: string;
    options: string[];
}

@Component({
    selector: 'app-imprint',
    templateUrl: './imprint.component.html',
    styleUrls: ['./imprint.component.scss'],
    standalone: true,
    imports: [
        // Les imports nécessaires
        MatIconModule,
        AsyncPipe,
        NgIf,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        NgForOf,
        MatInputModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatTableModule,
        MatButtonModule,
        MatStepperModule
    ]
})
export class ImprintComponent implements OnInit, OnChanges {
    @Input() variable: any;
    form: FormGroup;
    user$: Observable<User>;
    optionsNotImportant: Option[];
    optionsImportant: Option[];

    displayedColumns: string[] = ['question'];
    displayedInitialColumns: string[] = ['question'];
    dataSource: SurveyQuestion[];

    horizontalStepperForm: UntypedFormGroup;
    currentStepperIndex$: Observable<number>;

    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private _userService: UserService,
        private _imprintService: ImprintService,
        private _institutionService: InstitutionService,
        private _examService: ExamService,
        private _optionService: OptionService,
        private _router: Router,
        private _formBuilder: UntypedFormBuilder,
        private _stateService: StateService,
        private _answerService: AnswerService
    ) {
        this.currentStepperIndex$ = this._stateService.currentStepperIndex$;
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        this.horizontalStepperForm = this._formBuilder.group({});
        if (changes['variable']) {
            this.optionsNotImportant = [];

            // Traitez les nouvelles données ici
            this.form = this.fb.group({
            });

            this.createQuestions()

            this._optionService.optionsNotImportant$.subscribe(value => {
                this.optionsNotImportant = value;
                this.displayedColumns = ['question'];
                this.optionsNotImportant.forEach(option => {
                    this.displayedColumns.push(option.label);
                });
            });

            this._optionService.optionsImportant$.subscribe(value => {
                this.optionsImportant = value;
                this.displayedInitialColumns = ['question'];
                this.optionsImportant.forEach(option => {
                    this.displayedInitialColumns.push(option.label);
                });
            });

            this.displayedColumns.push('check');
            this.user$ = this._userService.user$;
            this.user$.subscribe(value => {
                // Assurez-vous que `this.user` est défini correctement
                // this.user = value;
            });

            // Pour peupler dataSource
            //this.dataSource = this.createDataSource();
        }
    }

    createQuestions() {

        this.horizontalStepperForm = this._formBuilder.group({});

      /*  this.variable.lastChildren.forEach(variable => {
            const questions = variable.questions.filter(question => !(question.weighting));
            const formControl = this.fb.control(null, Validators.required);
            this.form.addControl(questions[0]._id, formControl);
        });
      */

        // Nouvelle étape pour les questions avec weighting = true
        const initialStepGroup = this._formBuilder.group({});
        this.variable.children.forEach(child => {
            child.lastChildren.forEach(lastChild => {
                lastChild.questions.forEach(question => {
                    if (question.weighting) {
                        initialStepGroup.addControl(question._id, this._formBuilder.control('', Validators.required));
                    }
                });
            });
        });
        this.horizontalStepperForm.addControl('initialStep', initialStepGroup);

        this.variable.children.forEach((child, index) => {
            const stepGroup = this._formBuilder.group({});
            child.lastChildren.forEach(lastChild => {
                lastChild.questions.forEach(question => {
                    if (!question.weighting) {
                        stepGroup.addControl(question._id, this._formBuilder.control('', Validators.required));
                    }

                });
            });
            this.horizontalStepperForm.addControl(`step${index + 1}`, stepGroup);
        });

    }

/*    createDataSource(): SurveyQuestion[] {
        return this.variable.lastChildren.map(variable => {
            const questions = variable.questions.filter(question => !(question.weighting));
            return {
                _id: questions[0]._id,
                question: questions[0].label,
                response: '',
                options: this.optionsNotImportant.map(option => option.label)
            };
        });
    }*/

    getQuestions(stepIndex: number): any[] {
        return (this.variable.children[stepIndex]?.lastChildren.flatMap(child => child.questions) || []).filter(question => !(question.weighting));
    }

    getInitialQuestions(): any[] {
        const questions = [];
        this.variable.children.forEach(child => {
            child.lastChildren.forEach(lastChild => {
                lastChild.questions.forEach(question => {
                    if (question.weighting) {
                        questions.push(question);
                    }
                });
            });
        });
        return questions;
    }


    submitForm(): void {
        this.isLoading = true;
        const steps = this.horizontalStepperForm.value;
        let result = [];
        for (const key in steps) {
            if (steps.hasOwnProperty(key)) {
                const step = steps[key];
                for (const questionId in step) {
                    if (step.hasOwnProperty(questionId)) {
                        const optionId = step[questionId];
                        result.push({ questionId, optionId, examId: localStorage.getItem('exam') });
                    }
                }
            }
        }
        this._answerService.saveAnswer(result).subscribe(value => {
            this.isLoading = false;
            this._stateService.nextVariable();
        }, error => {

        })

    }

    nextStep(currentIndex: number): void {
        this._stateService.currentStepperIndex$.next(currentIndex + 1);
    }
}
