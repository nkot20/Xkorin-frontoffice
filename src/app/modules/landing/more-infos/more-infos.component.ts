import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatInputModule} from "@angular/material/input";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {UserService} from "../../../core/user/user.service";
import {Observable} from "rxjs";
import {Institution} from "../../../core/institution/institution.type";
import {InstitutionService} from "../../../core/institution/institution.service";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {User} from "../../../core/user/user.types";
import {Helper} from "../../../core/Common/Helper";

@Component({
    selector: 'app-more-infos',
    templateUrl: './more-infos.component.html',
    styleUrls: ['./more-infos.component.scss'],
    imports: [
        MatInputModule,
        ReactiveFormsModule,
        NgIf,
        MatButtonModule,
        RouterLink,
        MatProgressSpinnerModule,
        AsyncPipe,
        MatOptionModule,
        MatSelectModule,
        NgForOf
    ],
    standalone: true
})
export class MoreInfosComponent implements OnInit{

    imageSrc: string;
    signature: string;
    @ViewChild('moreInfosNgForm') moreInfosNgForm: NgForm;
    moreInfosForm: FormGroup;
    institutionId: string;
    id: string;
    loading = false;
    bussinessName = localStorage.getItem('mqjfldkfj');
    institutions: Institution[];
    user$: Observable<User>;
    userValue: User;

    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private _toastService: ToastrService,
        private _userService: UserService,
        private _institutionService: InstitutionService
    ) {
    }

    ngOnInit(): void {
        this.institutionId = localStorage.getItem('%institution%');
        this._institutionService.institutions$.subscribe(value => {
            this.institutions = value.filter(item => item._id !== this.institutionId);
        });
        this.user$ = this._userService.user$;
        this.moreInfosForm = this._formBuilder.group({
            logo: ['', Validators.required],
            signature: ['', Validators.required],
            website: [''],
            description: ['', Validators.required],
            email: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            programName: ['', Validators.required],
            targetInstitution: ['', Validators.required],
        });
        this._userService.user$.subscribe(value => {
            this.userValue = value;
        })

        //get company id
        this.id = localStorage.getItem('dfsmlmjlk');

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
                    this.signature = base64Image;
                    // Gérer la représentation en base64 de l'image selon vos besoins
                })
                .catch(error => {
                    console.error('Erreur lors de l\'upload de l\'image :', error);
                    // Gérer l'erreur
                });
        }
    }



    onSubmit() {
        this.loading = true;
        if (this.moreInfosForm.invalid) {
            return;
        }
        const datas = {
            institution: {
                //name: this.moreInfosForm.value['name'],
                email: this.moreInfosForm.value['email'],
                domain: this.moreInfosForm.value['website'],
                phoneNumber: this.moreInfosForm.value['phoneNumber'],
                description: this.moreInfosForm.value['description'],
                customization: {
                    logo: this.imageSrc,
                    signature: this.signature
                },
            },
            program: {
                name: this.moreInfosForm.value['programName'],
                targetInstitutionId: this.moreInfosForm.value['targetInstitution'],
                institutionId: this.userValue.institution._id
            }
        };

        this._institutionService.updateInstitutionAfterFirstInscription(this.userValue.id, this.userValue.institution._id, datas).subscribe(value => {
            this.loading = false;
            this._toastService.show('More informations added sucessfully', 'Register');
            this.router.navigate(['/signed-in-redirect']);
        }, error => {
            this._toastService.show('Something went to wrong', 'Register');
        });
    }

    /**
     * Tell us if image is logo or signature
     */
    changeTypeImagesValue (isLogo: boolean) {

    }
}
