import {Component, OnInit} from '@angular/core';
import {FuseAlertComponent, FuseAlertType} from "../../../../@fuse/components/alert";
import {FormsModule, ReactiveFormsModule, UntypedFormGroup} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
    standalone: true,
    imports      : [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
})
export class ConfirmEmailComponent implements OnInit{
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    forgotPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;


    constructor(private _authService: AuthService,) {
    }

    ngOnInit(): void {
    }
}
