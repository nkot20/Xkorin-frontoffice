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
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    data: any;
    selectedProject: string = 'ACME Corp. Backend App';
    infosDetails: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user$: Observable<any>;
    user: User;
    exams: any[];
    isLoading = true;
    isLoadingInfosDetails = true;
    isLoadingOtherDatas = true;
    totalAmount: number = 0;
    imprintsNames: string[] = [];
    exams$: Observable<any[]>;
    infosDatas$: Observable<any[]>;
    lastIndex: number = 0;
    averageIndex: number = 0;
    // Private
    lineChartData = [
        { data: [2, 3, 5, 7, 8, 10, 9, 11], label: 'Assessments' }
    ];

    lineChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

    lineChartOptions = {
        responsive: true
    };

    lineChartColors = [
        {
            borderColor: 'purple',
            backgroundColor: 'rgba(255,255,255,0)',
        },
    ];

    lineChartLegend = true;
    lineChartType = 'line';

    // Index chart data
    indexChartData = [
        { data: [1, 2, 3, 4, 5], label: 'Max', borderColor: 'green', fill: false },
        { data: [0.5, 1, 1.5, 2, 2.5], label: 'Min', borderColor: 'red', fill: false },
        { data: [0.8, 1.2, 1.6, 2.2, 2.8], label: 'Avg', borderColor: 'black', fill: false },
    ];

    indexChartLabels = ['Vulgarization', 'Training', 'Differentiation', 'Modernization', 'Networking'];

    indexChartOptions = {
        responsive: true
    };

    indexChartColors = [
        {
            borderColor: 'green',
            backgroundColor: 'rgba(255,255,255,0)',
        },
        {
            borderColor: 'red',
            backgroundColor: 'rgba(255,255,255,0)',
        },
        {
            borderColor: 'black',
            backgroundColor: 'rgba(255,255,255,0)',
        }
    ];

    indexChartLegend = true;
    indexChartType = 'line';

    /**
     * Constructor
     */
    constructor(
        private _projectService: ProjectService,
        private _router: Router,
        private _userService: UserService,
        private _examService: ExamService,
        private _imprintService: ImprintService
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

                // Prepare the chart data
                //this._prepareChartData();
            });

        this.user$ = this._userService.user$;
        this.user = this._userService.userValue;

        const personId = this._userService.userValue.person._id;
        // Get the boards
        this.exams$ = this._examService.getPersonExam(personId).pipe(
            tap( () => this.isLoading = true),
            tap( exams => {
                this.exams = exams;
                this.totalAmount = exams.reduce((sum, item) => sum + item.exam.amount, 0)
                this.isLoading = false; // Stop showing the loader
                //this._changeDetectorRef.detectChanges();
                this.renderChartAssessmentEvolution(exams);
            })
        );

        this.infosDatas$ = this._imprintService.getImprintsValuesEvolutionOfPerson(personId)
        .pipe(
            tap( () => this.isLoading = true),
            tap(infosDetails => {
                this.infosDetails = infosDetails;
                console.log(infosDetails)
                this.isLoadingInfosDetails = false;
                infosDetails.variableTree.forEach(item => {
                    this.imprintsNames.push(item.imprint.name)
                });
                this.lastIndex = this.infosDetails.evolution.indexValues[this.infosDetails.evolution.indexValues.length - 1].value
                this.averageIndex = (this.infosDetails.evolution.indexValues.reduce((sum, item) => sum + item.value)) / this.infosDetails.evolution.indexValues.length
                this.renderChartEvolution(this.infosDetails.evolution.indexValues, this.infosDetails.evolution.imprintsData);

            })
        );
    }

    renderChartEvolution(index: any[], imprintsData: any[]) {
        const ctx = document.getElementById('evolutionChart') as HTMLCanvasElement;
        const labels = index.map(data => data.date);
        const indexValues = index.map(data => data.value);
        const datasets = [{
            label: 'Index',
            data: indexValues,
            borderColor: 'blue',
            fill: false,
        },];

        const colors = ['red', 'green', 'orange', 'purple', 'brown'];

        imprintsData.forEach((imprintData, index) => {
            const imprintValues = imprintData.map(data => data.value);
            datasets.push({
                label: this.imprintsNames[index],
                data: imprintValues,
                borderColor: colors[index % colors.length],
                fill: false,
            });
        });
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderChartAssessmentEvolution(exams: any[]) {
        const examCountsByMonth = Array(12).fill(0);
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        exams.forEach(item => {
            const date = new Date(item.exam.createdAt);
            const month = date.getMonth(); // Extract month (0-based)
            examCountsByMonth[month]++;
        });

        const ctx = document.getElementById('examHistogram') as HTMLCanvasElement;
        //console.log(monthNames, examCountsByMonth)
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthNames,
                datasets: [{
                    label: 'Number of Exams',
                    data: examCountsByMonth,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
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
    private _fixSvgFill(element: Element): void
    {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) =>
            {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // Github issues
        this.chartGithubIssues = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false,
                },
                zoom      : {
                    enabled: false,
                },
            },
            colors     : ['#64748B', '#94A3B8'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0,
                },
            },
            grid       : {
                borderColor: 'var(--fuse-border)',
            },
            labels     : this.data.githubIssues.labels,
            legend     : {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series     : this.data.githubIssues.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke     : {
                width: [3, 0],
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark',
            },
            xaxis      : {
                axisBorder: {
                    show: false,
                },
                axisTicks : {
                    color: 'var(--fuse-border)',
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip   : {
                    enabled: false,
                },
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Task distribution
        this.chartTaskDistribution = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'polarArea',
                toolbar   : {
                    show: false,
                },
                zoom      : {
                    enabled: false,
                },
            },
            labels     : this.data.taskDistribution.labels,
            legend     : {
                position: 'bottom',
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)',
                    },
                    rings : {
                        strokeColor: 'var(--fuse-border)',
                    },
                },
            },
            series     : this.data.taskDistribution.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke     : {
                width: 2,
            },
            theme      : {
                monochrome: {
                    enabled       : true,
                    color         : '#93C5FD',
                    shadeIntensity: 0.75,
                    shadeTo       : 'dark',
                },
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark',
            },
            yaxis      : {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Budget distribution
        this.chartBudgetDistribution = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'radar',
                sparkline : {
                    enabled: true,
                },
            },
            colors     : ['#818CF8'],
            dataLabels : {
                enabled   : true,
                formatter : (val: number): string | number => `${val}%`,
                textAnchor: 'start',
                style     : {
                    fontSize  : '13px',
                    fontWeight: 500,
                },
                background: {
                    borderWidth: 0,
                    padding    : 4,
                },
                offsetY   : -15,
            },
            markers    : {
                strokeColors: '#818CF8',
                strokeWidth : 4,
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors   : 'var(--fuse-border)',
                        connectorColors: 'var(--fuse-border)',
                    },
                },
            },
            series     : this.data.budgetDistribution.series,
            stroke     : {
                width: 2,
            },
            tooltip    : {
                theme: 'dark',
                y    : {
                    formatter: (val: number): string => `${val}%`,
                },
            },
            xaxis      : {
                labels    : {
                    show : true,
                    style: {
                        fontSize  : '12px',
                        fontWeight: '500',
                    },
                },
                categories: this.data.budgetDistribution.categories,
            },
            yaxis      : {
                max       : (max: number): number => parseInt((max + 10).toFixed(0), 10),
                tickAmount: 7,
            },
        };

        // Weekly expenses
        this.chartWeeklyExpenses = {
            chart  : {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true,
                },
            },
            colors : ['#22D3EE'],
            series : this.data.weeklyExpenses.series,
            stroke : {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.weeklyExpenses.labels,
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Monthly expenses
        this.chartMonthlyExpenses = {
            chart  : {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true,
                },
            },
            colors : ['#4ADE80'],
            series : this.data.monthlyExpenses.series,
            stroke : {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.monthlyExpenses.labels,
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Yearly expenses
        this.chartYearlyExpenses = {
            chart  : {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true,
                },
            },
            colors : ['#FB7185'],
            series : this.data.yearlyExpenses.series,
            stroke : {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.yearlyExpenses.labels,
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };
    }
}
