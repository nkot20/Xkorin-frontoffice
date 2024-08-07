import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Option} from "../../../../core/option/option.types";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {OptionService} from "../../../../core/option/option.service";
import {VariableService} from "../../../../core/variable/variable.service";
import {Observable} from "rxjs";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {AsyncPipe, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatTabsModule} from "@angular/material/tabs";
import {MatRadioModule} from "@angular/material/radio";
import {WeightService} from "../../../../core/weight/weight.service";
import {ToastrService} from "ngx-toastr";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ImprintInstitutionService} from "../../../../core/imprintInstitution/imprint-institution.service";

@Component({
    selector: 'app-probes',
    templateUrl: './probes.component.html',
    styleUrls: ['./probes.component.scss'],
    standalone: true,
    imports: [
        AsyncPipe,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSortModule,
        NgForOf,
        NgIf,
        NgTemplateOutlet,
        MatTabsModule,
        MatRadioModule,
        MatTableModule,
        MatSlideToggleModule
    ]
})
export class ProbesComponent implements OnInit {
    options: Option[] = [];
    displayedColumns: string[] = [];
    defaultColumns: string[] = ['variable'];
    selectedOptions: { [key: string]: string } = {};
    variables$: Observable<any[]>;
    imprintStatus: Set<{_id: string, status: boolean, isAddedForAnInstitution: boolean}> = new Set();



    @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;

    constructor(
        private _optionService: OptionService,
        private _variableService: VariableService,
        private _weightService: WeightService,
        private _toastService: ToastrService,
        private _imprintInstitutionService: ImprintInstitutionService
        ) {
    }

    ngOnInit() {
        this.displayedColumns = ['variable'];
        this.variables$ = this._variableService.variables$;
        this._optionService.optionsImportant$.subscribe(value => {
            this.options = value;
            this.displayedColumns = [...this.defaultColumns];  // Reset to default columns
            value.forEach(option => this.displayedColumns.push(option._id));
        });

        this.variables$.subscribe(variables => {
            variables.forEach(variablesImprint => {
                this.imprintStatus.add({_id: variablesImprint._id, status: variablesImprint.status, isAddedForAnInstitution: variablesImprint.isAddedForAnInstitution})
                variablesImprint.dataSource = new MatTableDataSource(variablesImprint.variables);
            });
        });
    }

    ngAfterViewInit() {
        // Assign the correct paginator to each dataSource
        this.variables$.subscribe(variables => {
            this.paginators.forEach((paginator, index) => {
                if (variables[index] && variables[index].dataSource) {
                    variables[index].dataSource.paginator = paginator;
                }
            });
        });
    }

    changeDatasSource(datas: any[]) {
        // No need to change the dataSource here as each tab has its own dataSource
    }

    changeImportance(variableId, optionId) {
        const institutionId = localStorage.getItem('%institution%');
        const payload = {
            institutionId,
            variableId,
            optionId
        }
        this._weightService.save(payload).subscribe(value => {

        }, error =>  {
            this._toastService.error("Something went to wrong please try again", "Change importance value")
        })
    }

    changeImprintStatus(imprintId: string, currentStatus: string) {
        const newStatus = currentStatus === 'Able' ? 'Enable' : 'Able';
        this.variables$.subscribe(variables => {
            const imprint = variables.find(variable => variable._id === imprintId);
            if (imprint) {
                imprint.status = newStatus;
                const payload = {
                    imprintId: imprint._id,
                    status: newStatus,
                    institutionId: localStorage.getItem('%institution%'),
                    isAddedForAnInstitution: imprint.isAddedForAnInstitution
                };
                this._imprintInstitutionService.save(payload).subscribe(value => {
                })
            }
        });
    }


}
