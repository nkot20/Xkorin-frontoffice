import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../../core/user/user.service";
import {InstitutionService} from "../../../../../core/institution/institution.service";
import {Institution} from "../../../../../core/institution/institution.type";
import {Observable} from "rxjs";
import {User} from "../../../../../core/user/user.types";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {ProgramService} from "../../../../../core/program/program.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ImprintService} from "../../../../../core/imprint/imprint.service";

@Component({
  selector: 'app-modal-create-program',
  templateUrl: './modal-create-program.component.html',
  styleUrls: ['./modal-create-program.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, AsyncPipe, NgIf, ReactiveFormsModule, MatOptionModule, MatSelectModule, NgForOf, MatDialogModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCreateProgramComponent implements OnInit{

    readonly dialogRef = inject(MatDialogRef<ModalCreateProgramComponent>);
    @ViewChild('programNgForm') programNgForm: NgForm;
    programForm: FormGroup;

    institutionId: string;
    id: string;
    loading = false;
    institutions: Institution[];
    user$: Observable<User>;
    imprints: any[];
    userValue: User;

    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private _toastService: ToastrService,
        private _userService: UserService,
        private _institutionService: InstitutionService,
        private _programService: ProgramService,
        private _imprintService: ImprintService,

    ) {
    }

    ngOnInit() {
        this.institutionId = localStorage.getItem('%institution%');
        this._institutionService.institutions$.subscribe(value => {
            this.institutions = value.filter(item => item._id !== this.institutionId);
        });
        this._imprintService.imprints$.subscribe(value => {
            this.imprints = value;
        });
        this.user$ = this._userService.user$;

        this.programForm = this._formBuilder.group({
            name: ['', Validators.required],
            targetInstitutionId: ['', Validators.required],
            imprintIds: [[], Validators.required],
            maxParticipants: [null, [Validators.required, Validators.min(1)]],      // New field
            allocatedAmount: [null, [Validators.required, Validators.min(0)]]        // New field
        });

        this._userService.user$.subscribe(value => {
            this.userValue = value;
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        if (this.programForm.invalid) {
            return;
        }
        let payload = {
            name: this.programForm.value['name'],
            targetInstitutionId: this.programForm.value['targetInstitutionId'],
            institutionId: this.userValue.institution._id,
            amount: this.programForm.value['allocatedAmount'],
            numberOfParticipants: this.programForm.value['maxParticipants'],
            imprintIds: this.programForm.value['imprintIds'],
        }
        this._programService.createProgram(payload).subscribe(value => {
            this._toastService.success("Program added successfully", "Create program");
            this.dialogRef.close();
        }, error => {
            this._toastService.error("Something went to wrong please try again", "Create program");
        })

    }



}
