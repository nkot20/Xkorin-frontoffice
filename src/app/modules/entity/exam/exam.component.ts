import {Component, OnInit, ViewChild} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {UserService} from "../../../core/user/user.service";
import {User} from "../../../core/user/user.types";
import {Observable} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ImprintService} from "../../../core/imprint/imprint.service";
import {Institution} from "../../../core/institution/institution.type";
import {InstitutionService} from "../../../core/institution/institution.service";
import {FuseAlertComponent, FuseAlertType} from "../../../../@fuse/components/alert";
import {ExamService} from "../../../core/exam/exam.service";
import {Router, RouterLink} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProgramService} from "../../../core/program/program.service";
import {Program} from "../../../core/program/program.types";

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
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
        FuseAlertComponent,
        MatProgressSpinnerModule,
        RouterLink
    ]
})
export class ExamComponent implements OnInit {

    user$: Observable<User>;
    imprint$: Observable<any>
    institutions$: Observable<Institution[]>;
    institutions: Institution[] = [];
    programs: Program[] = [];
    examForm: UntypedFormGroup;
    @ViewChild('examNgForm') examNgForm: NgForm;
    showAlert: boolean = false;
    user: User;
    submit: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    selectedOptionAim: string;
    selectedOptionInstitution: string;

    constructor(
        private _userService: UserService,
        private _imprintService: ImprintService,
        private _institutionService: InstitutionService,
        private _formBuilder: UntypedFormBuilder,
        private _examService: ExamService,
        private _router: Router,
        private _programService: ProgramService
        ) {
    }

    ngOnInit() {
        this.user$ = this._userService.user$;
        this.user$.subscribe(value => {
            this.user = value;
        })
        this.imprint$ = this._imprintService.imprints$;
        this.institutions$ = this._institutionService.institutions$;

        this.examForm = this._formBuilder.group({
                institution  : ['', Validators.required],
                program  : ['', Validators.required],
                aim          : ['', [Validators.required]],
                amount       : [50000],
            },
        );
    }

    onSelectionChangeAim() {
       this._institutionService.getInstitutionsByType(this.selectedOptionAim).subscribe(value => {
           this.institutions = value;
       })
    }

    onSelectionChangeInstitution() {
        if (this.selectedOptionInstitution) {
            this._programService.getProgramsByInstitutionIdWithoutPagination(this.selectedOptionInstitution).subscribe(value => {
                this.programs = value;
            })
        }
    }


    /**
     * submit
     */
    onSubmit(): void
    {
        // Do nothing if the form is invalid

        if ( this.examForm.invalid )
        {
            return;
        }

        this.submit = true;

        // Disable the form
        this.examForm.disable();

        // Hide the alert
        this.showAlert = false;

        let payload = {
            programId: this.examForm.value['program'],
            aim: this.examForm.value['aim'],
            amount: this.examForm.value['amount'],
            personId: this.user.person._id
        }

        // Sign up
        this._examService.createExam(payload)
            .subscribe(
                (response) =>
                {
                    console.log(response)
                    // Navigate to the confirmation required page
                    localStorage.setItem('exam', response._id);
                    this.submit = false;
                    this._router.navigate(['/assessment/new/imprint']);
                },
                (response) =>
                {
                    // Re-enable the form
                    this.examForm.enable();

                    // Reset the form
                    this.examNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Something went wrong, please try again.',
                    };

                    // Show the alert
                    this.showAlert = true;
                },
            );
    }



}
