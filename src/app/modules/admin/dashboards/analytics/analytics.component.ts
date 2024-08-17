import {AsyncPipe, DecimalPipe, NgFor, NgIf} from '@angular/common';
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
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AnalyticsService } from 'app/modules/admin/dashboards/analytics/analytics.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import {Observable, Subject, takeUntil} from 'rxjs';
import {User} from "../../../../core/user/user.types";
import {ProjectService} from "../project/project.service";
import {UserService} from "../../../../core/user/user.service";
import {ExamService} from "../../../../core/exam/exam.service";
import {ImprintService} from "../../../../core/imprint/imprint.service";
import {MatCardModule} from "@angular/material/card";
import {TranslocoModule} from "@ngneat/transloco";

@Component({
    selector       : 'analytics',
    templateUrl    : './analytics.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [MatButtonModule, MatIconModule, MatMenuModule, MatButtonToggleModule, NgApexchartsModule, MatTooltipModule, NgFor, DecimalPipe, AsyncPipe, MatCardModule, NgIf, TranslocoModule],
})
export class AnalyticsComponent implements OnInit, OnDestroy
{
    data: any;
    infosDetails: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user$: Observable<any>;
    user: User;
    exams: any[];
    examsXkorin: any[];
    isLoading = true;
    isLoadingXkorin = true;
    isLoadingInfosDetails = true;
    totalAmount: number = 0;
    totalAmountXkorin: number = 0;

    examSeries: any[];
    examChartOptions: ApexOptions;
    examSeriesXkorin: any[];
    examChartOptionsXkorin: ApexOptions;
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

        const institutionId = this._userService.userValue.institution._id;
        // Get the boards
        this._examService.getAllExamsByInstitutionId(institutionId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({next: (exams: any) => {
                this.exams = exams;
                this.totalAmount = exams.reduce((sum, item) => sum + item.amount, 0)
                this.isLoading = false; // Stop showing the loader
                this.renderChartAssessmentEvolution(exams);
                this.cdr.detectChanges();
            }});
        this._examService.getAllExams()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({next: (exams: any) => {
                    this.examsXkorin = exams;
                    this.totalAmountXkorin = exams.reduce((sum, item) => sum + item.amount, 0)
                    this.isLoadingXkorin = false; // Stop showing the loader
                    this.renderChartAssessmentEvolutionXkorin(exams);
                    this.cdr.detectChanges();
                }});


    }


    renderChartAssessmentEvolution(exams: any[]) {
        const examCountsByMonth = Array(12).fill(0);
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        exams.forEach(item => {
            const date = new Date(item.createdAt);
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

    renderChartAssessmentEvolutionXkorin(exams: any[]) {
        const examCountsByMonth = Array(12).fill(0);
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        exams.forEach(item => {
            const date = new Date(item.createdAt);
            const month = date.getMonth();
            examCountsByMonth[month]++;
        });

        this.examSeriesXkorin = [
            {
                name: 'Number of Exams',
                data: examCountsByMonth
            }
        ];

        this.examChartOptionsXkorin = {
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



}
