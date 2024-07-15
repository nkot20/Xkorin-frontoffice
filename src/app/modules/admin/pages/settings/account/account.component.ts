import { TextFieldModule } from '@angular/cdk/text-field';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {UserService} from "../../../../../core/user/user.service";
import {async, Observable, Subject, takeUntil} from "rxjs";
import {User} from "../../../../../core/user/user.types";
import {ToastrService} from "ngx-toastr";

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, NgForOf, NgIf, AsyncPipe],
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: UntypedFormGroup;
    schoolLevel = ['Self-taugh', '1st School Living Certificate ', 'GCE O Level/ CAP', 'GCE A Level', '1st year Undergraduate', '2nd year undergraduate', '3rd year undergraduate', 'Postgraduate +1year', 'Masters', 'PhD', 'Other'];
    selectedFile: any = null;
    user$: Observable<User>
    userInfos: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        private toastr: ToastrService
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
        // Create the form

        this.user$ = this._userService.user$;
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.userInfos = user;
                console.log(user);
                this.accountForm = this._formBuilder.group({
                    name    : [user.name],
                    company : [user.company.name],
                    description   : [user.company.description],
                    email   : [user.email, Validators.email],
                    companyEmail   : [user.company.email, Validators.email],
                    phone   : [user.person.mobile_no],
                    country : [user.company.country],
                    language: [user.langage],
                    matrimonial: [user.person.matrimonial_status],
                    educationLavel: [user.person.level_of_education],
                    //logo: ['']
                });

                // Mark for check
                this._changeDetectorRef.markForCheck();

            });
    }

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0] ?? null;

    }

    onSubmit() {
        const user = {
            name: this.accountForm.value['name'],
            email: this.accountForm.value['email'],
            mobile_no: this.accountForm.value['phone'],
        };
        const person = {
            _id: this.userInfos.person._id,
            mobile_no: this.accountForm.value['phone'],
            matrimonial_status: this.accountForm.value['matrimonial'],
            level_of_education: this.accountForm.value['educationLavel']
        };

        const company = {
            _id: this.userInfos.company._id,
            company: this.accountForm.value['company'],
            description: this.accountForm.value['description'],
            country: this.accountForm.value['country'],
            email: this.accountForm.value['email'],
        }

        console.log(user, person, company);
        this._userService.update(this.userInfos.id, {user, person, company}).subscribe(value => {
            this.toastr.success('Updated successfully', 'Account');
        }, error => {
            this.toastr.error('Something went to wrong please try again', 'Account');
        })
    }

    protected readonly async = async;
}
