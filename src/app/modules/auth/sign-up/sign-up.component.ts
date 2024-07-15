import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    AbstractControl,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup, ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {MatSelectModule} from "@angular/material/select";
import {SubCategory} from "../../../core/subCategory/sub-category.types";
import {Observable} from "rxjs";
import {SubCategoryService} from "../../../core/subCategory/sub-category.service";
import {Profil} from "../../../core/profil/profil.types";
import {ProfilService} from "../../../core/profil/profil.service";

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports: [RouterLink, NgIf, NgForOf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule, MatSelectModule, AsyncPipe],
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;
    subCategories$: Observable<SubCategory[]>;
    profils$: Observable<Profil[]>;
    categoryType: string ;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _subCategoryService: SubCategoryService,
        private _profilService: ProfilService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.subCategories$ = this._subCategoryService.subCategories$;
        this.profils$ = this._profilService.profils$;
        this.categoryType = localStorage.getItem('categoryType');
        if (this.categoryType === "company") {
            // Create the form
            this.signUpForm = this._formBuilder.group({
                    name        : ['', Validators.required],
                    email       : ['', [Validators.required, Validators.email]],
                    password    : ['', [Validators.required, this.strongPasswordValidator()]],
                    company     : ['', Validators.required],
                    subcategory : ['', Validators.required],
                    profil      : ['', Validators.required],
                    agreements  : ['', Validators.requiredTrue],
                    type  : [this.categoryType],
                },
            );
        } else {
            // Create the form
            this.signUpForm = this._formBuilder.group({
                    name        : ['', Validators.required],
                    email       : ['', [Validators.required, Validators.email, this.institutionalEmailValidator()]],
                    password    : ['', [Validators.required, this.strongPasswordValidator()], ],
                    company     : ['', Validators.required],
                    subcategory : ['', Validators.required],
                    agreements  : ['', Validators.requiredTrue],
                    type  : [this.categoryType],
                },
            );
        }

    }

    institutionalEmailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null; // Don't validate empty values to allow for the required validator to handle it
            }
            const email = control.value;
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac|gov|mil|org|net|int)$/i;

            if (regex.test(email)) {
                return null; // Valid email
            } else {
                return { institutionalEmail: true }; // Invalid email
            }
        };
    }


    strongPasswordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.value;
            if (!password) {
                return null; // Don't validate empty values to allow for the required validator to handle it
            }

            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const minLength = password.length >= 8;

            const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && minLength;

            if (!passwordValid) {
                return { strongPassword: true };
            }

            return null;
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        console.log(this.signUpForm.value,this.signUpForm, this.signUpForm.invalid)
        // Do nothing if the form is invalid
        if ( this.signUpForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(this.signUpForm.value)
            .subscribe(
                (response) =>
                {
                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/confirmation-required');
                },
                (response) =>
                {

                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    //this.signUpNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: response.error.message,
                    };

                    // Show the alert
                    this.showAlert = true;
                },
            );
    }
}
