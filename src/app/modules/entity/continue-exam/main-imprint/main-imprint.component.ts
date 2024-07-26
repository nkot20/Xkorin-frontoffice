import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ImprintService} from "../../../../core/imprint/imprint.service";
import {UserService} from "../../../../core/user/user.service";
import {InstitutionService} from "../../../../core/institution/institution.service";
import {UntypedFormBuilder} from "@angular/forms";
import {ExamService} from "../../../../core/exam/exam.service";
import {OptionService} from "../../../../core/option/option.service";
import {ActivatedRouteSnapshot, Router, RouterLink, RouterStateSnapshot} from "@angular/router";
import {Observable, switchMap} from "rxjs";
import {User} from "../../../../core/user/user.types";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FuseAlertComponent} from "../../../../../@fuse/components/alert";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatTableModule} from "@angular/material/table";
import {ImprintComponent} from "../imprint/imprint.component";
import {StateService} from "../../../../core/state/state.service";

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
        ImprintComponent,
        RouterLink
    ]
})
export class MainImprintComponent implements OnInit, OnChanges{

    data: any;
    imprints$: Observable<any[]>;
    currentImprintIndex: number = 0;
    currentVariableIndex: number = 0;
    user$: Observable<User>;
    variableAlreadyReaded: any[] = [];
    currentVariable: any;
    currentImprintIndex$: Observable<number>;
    currentVariableIndex$: Observable<number>;


    constructor(
        private _userService: UserService,
        private _imprintService: ImprintService,
        private _institutionService: InstitutionService,
        private _formBuilder: UntypedFormBuilder,
        private _examService: ExamService,
        private _optionService: OptionService,
        private _router: Router,
        private _stateService: StateService,
        private router: Router,
    ) {
        this.currentImprintIndex$ = this._stateService.currentImprintIndex$;
        this.currentVariableIndex$ = this._stateService.currentVariableIndex$;

    }

    ngOnInit() {
        if (!localStorage.getItem('exam')) {
            this.router.navigate(['/evaluation/new']);
        }
        this.imprints$ = this._imprintService.imprints$;
        this.user$ = this._userService.user$;
        this.updateCurrentState();


    }

    ngOnChanges(changes: SimpleChanges) {

    }

    updateCurrentState() {
        this._stateService.currentVariableIndex$.subscribe(index => {
            this._stateService.currentImprintIndex$.subscribe(indexImprint => {
                console.log(indexImprint)
                console.log(this._stateService.getData())
                this.variableAlreadyReaded = this._stateService.getData()[indexImprint].variables.slice(0, this._stateService.currentVariableIndexSource$.value + 1);
                this.currentVariable = this._stateService.getData()[indexImprint].variables[this._stateService.currentVariableIndexSource$.value];
            })
        });
    }



}
