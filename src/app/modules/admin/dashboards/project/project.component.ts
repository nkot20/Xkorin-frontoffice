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

Chart.register(...registerables);

@Component({
    selector       : 'project',
    templateUrl    : './project.component.html',
    styleUrls      : ['./project.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [TranslocoModule, MatIconModule, MatButtonModule, MatRippleModule, MatMenuModule, MatTabsModule, MatButtonToggleModule, NgApexchartsModule, NgFor, NgIf, MatTableModule, NgClass, CurrencyPipe, AsyncPipe, MatCardModule],
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
    // Private
    indexSeries: any[];
    indexChartOptions: ApexOptions;

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

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the data
        this._projectService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) =>
            {
                // Store the data
                this.data = data;

            });

        this.user$ = this._userService.user$;
        this.user = this._userService.userValue;

        const personId = this._userService.userValue.person._id;
        // Get the boards
       this._examService.getPersonExam(personId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({next: (exams: any) => {
                    this.exams = exams;
                    this.totalAmount = exams.reduce((sum, item) => sum + item.exam.amount, 0)
                    this.isLoading = false; // Stop showing the loader
                    this.cdr.detectChanges();
                    this.renderChartAssessmentEvolution(exams);
            }});

        this._imprintService.getImprintsValuesEvolutionOfPerson(personId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({next: (infosDetails: any) => {
                    this.infosDetails = infosDetails;
                    this.isLoadingInfosDetails = false;
                    infosDetails.variableTree.forEach(item => {
                        this.imprintsNames.push(item.imprint.name)
                    });
                    this.lastIndex = this.infosDetails.evolution.indexValues[this.infosDetails.evolution.indexValues.length - 1].value
                    this.averageIndex = (this.infosDetails.evolution.indexValues.reduce((sum, item) => sum + item.value, 0)) / (this.infosDetails.evolution.indexValues.length === 0 ? 1: this.infosDetails.evolution.indexValues.length)
                    this.renderChartEvolution(this.infosDetails.evolution.indexValues, this.infosDetails.evolution.imprintsData);
                    this.cdr.detectChanges();
                }})

    }

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


    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */



}
