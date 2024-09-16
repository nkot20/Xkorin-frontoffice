import {AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ProjectService } from 'app/modules/admin/dashboards/project/project.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import {Observable, Subject, takeUntil, tap} from 'rxjs';
import {UserService} from "../../../../core/user/user.service";
import {MatCardModule} from "@angular/material/card";
import {ExamService} from "../../../../core/exam/exam.service";
import {ImprintService} from "../../../../core/imprint/imprint.service";
import {Chart, registerables} from "chart.js";
import {User} from "../../../../core/user/user.types";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";

Chart.register(...registerables);

@Component({
    selector       : 'project',
    templateUrl    : './project.component.html',
    styleUrls      : ['./project.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [TranslocoModule, MatIconModule, MatButtonModule, MatRippleModule, MatMenuModule, MatTabsModule, MatButtonToggleModule, NgApexchartsModule, NgFor, NgIf, MatTableModule, NgClass, CurrencyPipe, AsyncPipe, MatCardModule, MatCheckboxModule, FormsModule, MatInputModule, MatSelectModule],
})
export class ProjectComponent implements OnInit, OnDestroy
{
    data: any;
    infosDetails: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user$: Observable<any>;
    user: User;
    exams: any[];
    isLoading = true;
    isLoadingInfosDetails = true;
    totalAmount: number = 0;
    imprintsNames: string[] = [];
    lastIndex: number = 0;
    averageIndex: number = 0;
    examSeries: any[];
    examChartOptions: ApexOptions;
    indexSeries: any[];
    indexChartOptions: ApexOptions;
    displayedSeries: any[]; // Séries à afficher
    selectedSeries: any[] = []; // Séries sélectionnées

    /**
     * Constructor
     */
    constructor(
        private _projectService: ProjectService,
        private _router: Router,
        private _userService: UserService,
        private _examService: ExamService,
        private _imprintService: ImprintService,
        private cdr: ChangeDetectorRef
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void
    {
        // Charger les données des examens et empreintes
        this.user$ = this._userService.user$;
        this.user = this._userService.userValue;

        const personId = this._userService.userValue.person._id;

        // Récupérer les examens
        this._examService.getPersonExam(personId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((exams: any) => {
                this.exams = exams;
                this.totalAmount = exams.reduce((sum, item) => sum + item.exam.amount, 0);
                this.isLoading = false;
                this.cdr.detectChanges();
                this.renderChartAssessmentEvolution(exams);
            });

        // Récupérer les empreintes
        this._imprintService.getImprintsValuesEvolutionOfPerson(personId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((infosDetails: any) => {
                this.infosDetails = infosDetails;
                this.isLoadingInfosDetails = false;
                infosDetails.variableTree.forEach(item => {
                    this.imprintsNames.push(item.imprint.name);
                });
                this.lastIndex = this.infosDetails.evolution.indexValues[this.infosDetails.evolution.indexValues.length - 1].value;
                this.averageIndex = this.infosDetails.evolution.indexValues.reduce((sum, item) => sum + item.value, 0) / (this.infosDetails.evolution.indexValues.length || 1);
                this.renderChartEvolution(this.infosDetails.evolution.indexValues, this.infosDetails.evolution.imprintsData);
                this.cdr.detectChanges();
            });
    }

    // Méthode pour afficher l'évolution de l'index
    renderChartEvolution(index: any[], imprintsData: any[]) {
        const labels = index.map(data => data.date);
        const indexValues = index.map(data => data.value);

        this.indexSeries = [
            {
                name: 'Index',
                data: indexValues
            },
            ...imprintsData.map((imprintData, idx) => ({
                name: this.imprintsNames[idx],
                data: imprintData.map(data => data.value)
            }))
        ];

        this.selectedSeries = this.indexSeries.map(serie => serie.name); // Sélectionner toutes les séries par défaut
        this.updateDisplayedSeries(); // Mettre à jour les séries affichées

        this.indexChartOptions = {
            chart: {
                type: 'line',
                height: 480
            },
            xaxis: {
                categories: labels
            },
            yaxis: {
                min: 0
            },
            stroke: {
                curve: 'smooth'
            },
            colors: ['#0000ff', '#ff0000', '#00ff00', '#ffa500', '#800080'],
            dataLabels: {
                enabled: true
            }
        };
    }

    // Méthode pour afficher les examens
    renderChartAssessmentEvolution(exams: any[]) {
        const examCountsByMonth = Array(12).fill(0);
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        exams.forEach(item => {
            const date = new Date(item.exam.createdAt);
            const month = date.getMonth();
            examCountsByMonth[month]++;
        });

        this.examSeries = [
            {
                name: 'Number of Exams',
                data: examCountsByMonth
            }
        ];

        this.examChartOptions = {
            chart: {
                type: 'line',
                height: 480
            },
            xaxis: {
                categories: monthNames
            },
            yaxis: {
                min: 0
            },
            stroke: {
                curve: 'smooth'
            },
            colors: ['#4bc0c0'],
            dataLabels: {
                enabled: true
            }
        };
    }

    // Méthode pour mettre à jour les séries affichées
    updateDisplayedSeries() {
        this.displayedSeries = this.indexSeries.filter(serie => this.selectedSeries.includes(serie.name));
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
