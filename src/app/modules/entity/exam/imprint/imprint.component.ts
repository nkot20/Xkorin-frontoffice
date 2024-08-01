import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../../core/user/user.types';
import { Option } from '../../../../core/option/option.types';
import { UserService } from '../../../../core/user/user.service';
import { ImprintService } from '../../../../core/imprint/imprint.service';
import { InstitutionService } from '../../../../core/institution/institution.service';
import { ExamService } from '../../../../core/exam/exam.service';
import { OptionService } from '../../../../core/option/option.service';
import { Router } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'; // Importez MatTableDataSource
import { StateService } from "../../../../core/state/state.service";
import { AnswerService } from "../../../../core/answer/answer.service";

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
export class ImprintComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() variable: any;
    form: FormGroup;
    user$: Observable<User>;
    optionsNotImportant: Option[];
    optionsImportant: Option[];

    displayedColumns: string[] = ['question'];
    displayedInitialColumns: string[] = ['question'];

    initialQuestionsDataSource = new MatTableDataSource<any>(); // Source de données pour le step initial
    questionsDataSources: MatTableDataSource<any>[] = []; // Sources de données pour chaque étape

    @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>; // Pour gérer plusieurs paginators

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
        // Vous pouvez initialiser d'autres variables si nécessaire
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.horizontalStepperForm = this._formBuilder.group({});
        if (changes['variable']) {
            this.optionsNotImportant = [];
            this.form = this.fb.group({});

            this.createQuestions();

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
        }
    }

    ngAfterViewInit(): void {
        // Associez chaque MatPaginator à son MatTableDataSource correspondant
        this.paginators.changes.subscribe(() => {
            if (this.paginators.length > 0) {
                this.initialQuestionsDataSource.paginator = this.paginators.toArray()[0];
                this.questionsDataSources.forEach((dataSource, index) => {
                    dataSource.paginator = this.paginators.toArray()[index + 1];
                });
            }
        });
    }

    createQuestions() {
        this.horizontalStepperForm = this._formBuilder.group({});

        // Créez des questions pour le step initial
        const initialStepGroup = this._formBuilder.group({});
        const initialQuestions = [];
        this.variable.children.forEach(child => {
            child.lastChildren.forEach(lastChild => {
                lastChild.questions.forEach(question => {
                    if (question.weighting) {
                        initialStepGroup.addControl(question._id, this._formBuilder.control('', Validators.required));
                        initialQuestions.push(question);
                    }
                });
            });
        });
        this.horizontalStepperForm.addControl('initialStep', initialStepGroup);
        this.initialQuestionsDataSource.data = initialQuestions; // Initialisez le data source pour le step initial

        // Créez des questions pour les autres steps
        this.variable.children.forEach((child, index) => {
            const stepGroup = this._formBuilder.group({});
            const childQuestions = [];
            child.lastChildren.forEach(lastChild => {
                lastChild.questions.forEach(question => {
                    if (!question.weighting) {
                        stepGroup.addControl(question._id, this._formBuilder.control('', Validators.required));
                        childQuestions.push(question);
                    }
                });
            });
            this.horizontalStepperForm.addControl(`step${index + 1}`, stepGroup);

            // Créez et ajoutez une nouvelle MatTableDataSource pour chaque step
            const dataSource = new MatTableDataSource<any>(childQuestions);
            this.questionsDataSources.push(dataSource);
        });
    }

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
        this._stateService.nextVariable();
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

        }, error => {
            // Gérer les erreurs
            this.isLoading = false;
        });
    }

    nextStep(currentIndex: number): void {
        this._stateService.currentStepperIndex$.next(currentIndex + 1);
    }
}
