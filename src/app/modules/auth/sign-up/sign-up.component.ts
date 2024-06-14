import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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

        // Create the form
        this.signUpForm = this._formBuilder.group({
                name        : ['', Validators.required],
                email       : ['', [Validators.required, Validators.email]],
                password    : ['', Validators.required],
                company     : ['', Validators.required],
                subcategory : ['', Validators.required],
                profil      : ['', Validators.required],
                agreements  : ['', Validators.requiredTrue],
            },
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
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
                    this.signUpNgForm.resetForm();

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
