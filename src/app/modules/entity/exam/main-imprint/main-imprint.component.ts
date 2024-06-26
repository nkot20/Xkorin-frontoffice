import {Component, OnInit} from '@angular/core';
import {ImprintService} from "../../../../core/imprint/imprint.service";
import {UserService} from "../../../../core/user/user.service";
import {InstitutionService} from "../../../../core/institution/institution.service";
import {UntypedFormBuilder} from "@angular/forms";
import {ExamService} from "../../../../core/exam/exam.service";
import {OptionService} from "../../../../core/option/option.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {User} from "../../../../core/user/user.types";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FuseAlertComponent} from "../../../../../@fuse/components/alert";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatTableModule} from "@angular/material/table";
import {ImprintComponent} from "../imprint/imprint.component";

@Component({
    selector: 'app-main-imprint',
    templateUrl: './main-imprint.component.html',
    styleUrls: ['./main-imprint.component.scss'],
    standalone: true,
    imports: [
        AsyncPipe,
        FuseAlertComponent,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatTableModule,
        NgForOf,
        NgIf,
        ImprintComponent
    ]
})
export class MainImprintComponent implements OnInit{

    data: any;
    imprints$: Observable<any[]>;
    currentImprintIndex: number = 0;
    currentVariableIndex: number = 0;
    user$: Observable<User>;
    variableAlreadyReaded: any[] = [];
    currentVariable: any;

    constructor(
        private _userService: UserService,
        private _imprintService: ImprintService,
        private _institutionService: InstitutionService,
        private _formBuilder: UntypedFormBuilder,
        private _examService: ExamService,
        private _optionService: OptionService,
        private _router: Router
    ) {
    }

    ngOnInit() {

        this._imprintService.imprints$.subscribe(value => {

            this.data = [(value.reverse())[0]];
            this.variableAlreadyReaded.push(this.data[this.currentImprintIndex].variables[this.currentVariableIndex])
            this.currentVariable = this.data[this.currentImprintIndex].variables[this.currentVariableIndex]
        });
        this.imprints$ = this._imprintService.imprints$;
        this.user$ = this._userService.user$;
    }



    nextVariable() {
        this.variableAlreadyReaded = [];
        if (this.currentVariableIndex < this.data[this.currentImprintIndex].variables.length - 1) {
            this.currentVariableIndex++;
            for (let i = 0; i <= this.currentVariableIndex; i++) {
                this.variableAlreadyReaded.push(this.data[this.currentImprintIndex].variables[i])
            }

        } else {
            this.nextImprint();
        }
        this.currentVariable = this.data[this.currentImprintIndex].variables[this.currentVariableIndex]
    }

    nextImprint() {
        if (this.currentImprintIndex < this.data.length - 1) {
            this.currentImprintIndex++;
            this.currentVariableIndex = 0;
        }
    }

    isLastVariable(): boolean {
        return this.currentVariableIndex === this.data[this.currentImprintIndex].variables.length - 1;
    }

    isLastImprint(): boolean {
        return this.currentImprintIndex === this.data.length - 1;
    }

}
