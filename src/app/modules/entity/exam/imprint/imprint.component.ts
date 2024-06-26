import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../../core/user/user.types';
import { Option } from '../../../../core/option/option.types';
import { UserService } from '../../../../core/user/user.service';
import { ImprintService } from '../../../../core/imprint/imprint.service';
import { InstitutionService } from '../../../../core/institution/institution.service';
import { ExamService } from '../../../../core/exam/exam.service';
import { OptionService } from '../../../../core/option/option.service';
import { Router } from '@angular/router';
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
        MatButtonModule
    ]
})
export class ImprintComponent implements OnInit, OnChanges {
    @Input() variable: any;
    form: FormGroup;
    user$: Observable<User>;
    optionsNotImportant: Option[];
    optionsImportant: Option[];

    displayedColumns: string[] = ['question'];
    dataSource: SurveyQuestion[];

    constructor(
        private fb: FormBuilder,
        private _userService: UserService,
        private _imprintService: ImprintService,
        private _institutionService: InstitutionService,
        private _examService: ExamService,
        private _optionService: OptionService,
        private _router: Router
    ) {}

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {


        if (changes['variable']) {
            this.optionsNotImportant = [];

            // Traitez les nouvelles données ici
            console.log('Variable updated:', this.variable);
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
            });

            this.displayedColumns.push('check');
            this.user$ = this._userService.user$;
            this.user$.subscribe(value => {
                // Assurez-vous que `this.user` est défini correctement
                // this.user = value;
            });

            // Pour peupler dataSource
            this.dataSource = this.createDataSource();
        }
    }

    createQuestions() {
        this.variable.lastChildren.forEach(variable => {
            const questions = variable.questions.filter(question => !(question.weighting));
            const formControl = this.fb.control(null, Validators.required);
            this.form.addControl(questions[0]._id, formControl);
        });

    }

    createDataSource(): SurveyQuestion[] {
        return this.variable.lastChildren.map(variable => {
            const questions = variable.questions.filter(question => !(question.weighting));
            return {
                _id: questions[0]._id,
                question: questions[0].label,
                response: '',
                options: this.optionsNotImportant.map(option => option.label)
            };
        });
    }



    submitForm(): void {
        console.log(this.dataSource)
        console.log(this.form.value);
    }
}
