import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
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
import {UserRoles} from "../../../../../core/role/role.types";
import {Helper} from "../../../../../core/Common/Helper";
import SignaturePad from "signature_pad";
import {NgxFileDropModule} from "ngx-file-drop";

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, NgForOf, NgIf, AsyncPipe, NgxFileDropModule],
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: UntypedFormGroup;
    files: File[] = [];
    schoolLevel = ['Self-taugh', '1st School Living Certificate ', 'GCE O Level/ CAP', 'GCE A Level', '1st year Undergraduate', '2nd year undergraduate', '3rd year undergraduate', 'Postgraduate +1year', 'Masters', 'PhD', 'Other'];
    selectedFile: any = null;
    signatureSrc: string;
    imageSrc: string;
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
        //this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement);

        // Create the form

        this.user$ = this._userService.user$;
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.userInfos = user;
                if (user.role.includes(UserRoles.COMPANY_ADMIN) || user.role.includes(UserRoles.COMPANY_EMPLOYEE)) {
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
                } if (user.role.includes(UserRoles.INSTITUTION_ADMIN)) {
                    this.imageSrc = user.institution.customization.logo;
                    this.signatureSrc = user.institution.customization.signature;
                    this.accountForm = this._formBuilder.group({
                        name    : [user.name],
                        company : [user.institution.name],
                        description   : [user.institution.description],
                        email   : [user.email, Validators.email],
                        logo   : [user.institution.customization.logo],
                        signature   : [user.institution.customization.signature],
                        companyEmail   : [user.institution.email, Validators.email],
                        //phone   : [user.institution.mobile_no],
                        language: [user.langage],

                        //logo: ['']
                    });
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();

            });
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

        this._userService.update(this.userInfos.id, {user, person, company}).subscribe(value => {
            this.toastr.success('Updated successfully', 'Account');
        }, error => {
            this.toastr.error('Something went to wrong please try again', 'Account');
        })
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            // Vérifier si le fichier est bien une image
            if (!file.type.startsWith('image/')) {
                console.error('Le fichier sélectionné n\'est pas une image.');
                return;
            }
            Helper.uploadImage(file)
                .then(base64Image => {
                    this.imageSrc = base64Image;
                    this.accountForm.patchValue({ logo: file });
                    this.accountForm.get('logo')?.updateValueAndValidity();
                    // Gérer la représentation en base64 de l'image selon vos besoins
                })
                .catch(error => {
                    console.error('Erreur lors de l\'upload de l\'image :', error);
                    // Gérer l'erreur
                });
        }
    }

    onFileSelectedToSignature(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            // Vérifier si le fichier est bien une image
            if (!file.type.startsWith('image/')) {
                console.error('Le fichier sélectionné n\'est pas une image.');
                return;
            }
            Helper.uploadImage(file)
                .then(base64Image => {
                    this.signatureSrc = base64Image;
                    console.log(this.signatureSrc)

                    // Gérer la représentation en base64 de l'image selon vos besoins
                })
                .catch(error => {
                    console.error('Erreur lors de l\'upload de l\'image :', error);
                    // Gérer l'erreur
                });
        }
    }

    public dropped(files: File[]) {
        this.files = files;
    }

    public upload() {
        const formData = new FormData();
        this.files.forEach(file => formData.append('files', file));
    }


    hasRole(role) {
        return this.userInfos.role.includes(role);
    }


    protected readonly async = async;
    protected readonly UserRoles = UserRoles;
}
