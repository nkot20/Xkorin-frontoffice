import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CommonModule, NgClass, NgForOf } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import {ApexAxisChartSeries, NgApexchartsModule} from "ng-apexcharts";
import { MatTabsModule } from "@angular/material/tabs";
import {Observable, Subject, Subscription, takeUntil, tap} from "rxjs";
import { ImprintService } from "../../../../../core/imprint/imprint.service";
import { ExamService } from "../../../../../core/exam/exam.service";
import { environment } from "../../../../../../environments/environment";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ApexChart, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import {UserService} from "../../../../../core/user/user.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";

@Component({
    selector: 'app-detail-exam',
    templateUrl: './detail-exam.component.html',
    styleUrls: ['./detail-exam.component.scss'],
    standalone: true,
    imports: [
        MatProgressBarModule,
        NgClass,
        NgForOf,
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatMenuModule,
        NgApexchartsModule,
        MatTabsModule,
        RouterLink,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatCardModule
    ]
})
export class DetailExamComponent implements AfterViewInit, OnInit {
    @ViewChild('chart') chart: ChartComponent;

    public chartOptions: {
        series: ApexAxisChartSeries;
        chart: ApexChart;
        xaxis: ApexXAxis;
        yaxis: ApexYAxis;
    };

    imprints$: Observable<any[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    imprints: any[];
    imprintsValues$: Subscription;
    imprintsValues: number[];
    imprintStats: any[];
    examDetails: any;
    cci: number;
    categories = [
        { name: 'Personal relationship', statuses: ['green star', 'green star', 'green star', 'green star', 'green star', 'green star', 'green star'] },
        { name: 'Stay in family', statuses: ['green', 'green', 'green', 'gray', 'gray', 'green star', 'green star'] },
        { name: 'Member of a local association', statuses: ['green', 'green', 'green', 'gray', 'gray', 'green star', 'green star'] },
        { name: 'Member of an association', statuses: ['green star', 'green star', 'green star', 'green star', 'gray', 'green star', 'green star'] },
        { name: 'Contribute to the well-being', statuses: ['red', 'red', 'red', 'gray', 'gray', 'green star', 'green star'] }
    ];

    progress = 80;
    urlCertificat: string = environment.apiFile + '/certificats/imprints-fusion/';
    examId: string;
    loadingExam = true;
    loadingImprints = true;
    loadingImprintsValue = true;
    loadingStatistiques = true;
    indexIsAvalaible = false;
    companyName = '';
    displayedSeries: any[]; // Séries à afficher
    selectedSeries: any[] = []; // Séries sélectionnées
    indexSeries: any[] =[];

    constructor(
        private _imprintService: ImprintService,
        private _examService: ExamService,
        private _userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.examId = this.route.snapshot.paramMap.get('id');
        this.urlCertificat = this.urlCertificat + this.examId + ".pdf";
        this.companyName = this._userService.userValue.company.name;
        this.urlCertificat = `${this._examService.idExam}.pdf`;

        this._imprintService.getStatistics()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({next: (stats: any[]) => {
                    this.imprintStats = stats;
                    this.loadingStatistiques = false;

            }})

        this._examService.getExamById(this.examId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({next: (exam: any) => {
                    this.examDetails = exam;
                    this.loadingExam = false;
            }});

        this.imprints$ = this._imprintService.getImprintsByExam(this.examId)
            .pipe(
            tap(() => this.loadingImprints = true),
            tap(imprints => {
                this.imprints = imprints;
                this.indexIsAvalaible = this.imprints.every(value => value.isAvailable);
                this.loadingImprints = false;
            })
        );



        this.imprintsValues$ = this._imprintService.getImprintsValues(this.examId).pipe(
            tap(() => this.loadingImprintsValue = true),
            tap(values => {
                this.imprintsValues = values;
                this.cci = values.reduce((sum, value) => sum + value, 0);
                this.loadingImprintsValue = false;
                this.renderChart(this.imprintStats);
            })
        ).subscribe({
            next: () => this.loadingImprintsValue = false,
            error: () => this.loadingImprintsValue = false
        });
    }

    ngAfterViewInit() {
        // Render the chart after ensuring the statistics data is loaded

    }

    renderChart(datas: any[]) {
        const min = [];
        const max = [];
        const moy = [];
        const labels = [];
        datas.forEach(value => {
            labels.push(value.imprint);
            min.push(value.minValue);
            max.push(value.maxValue);
            moy.push(value.averageValue);
        });
        this.indexSeries = [
            {
                name: 'Min',
                data: min
            },
            {
                name: 'Moy',
                data: moy
            },
            {
                name: 'Max',
                data: max
            },
            {
                name: 'Current',
                data: this.imprintsValues
            }
        ];
        this.selectedSeries = this.indexSeries.map(serie => serie.name); // Sélectionner toutes les séries par défaut
        this.updateDisplayedSeries(); // Mettre à jour les séries affichées
        this.chartOptions = {
            series: [
                {
                    name: 'Min',
                    data: min
                },
                {
                    name: 'Moy',
                    data: moy
                },
                {
                    name: 'Max',
                    data: max
                },
                {
                    name: 'Current',
                    data: this.imprintsValues
                }
            ],
            chart: {
                type: 'line',
                height: 350
            },
            xaxis: {
                categories: labels
            },
            yaxis: {
                min: 0
            }
        };
    }

    toArray(value: number) {
        return Array(value).fill(0);
    }

    completedAssessment() {
        console.log(this.examId)
        this.router.navigate(['/assessment/complete/' + this.examId]);
    }

    // Méthode pour mettre à jour les séries affichées
    updateDisplayedSeries() {
        this.displayedSeries = this.indexSeries.filter(serie => this.selectedSeries.includes(serie.name));
    }

}
