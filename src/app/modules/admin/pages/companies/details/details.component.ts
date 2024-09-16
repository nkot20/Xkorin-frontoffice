import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable, BehaviorSubject, combineLatest, takeUntil, Subject} from "rxjs";
import { tap, filter, switchMap } from 'rxjs/operators';
import { environment } from "../../../../../../environments/environment";
import { ImprintService } from "../../../../../core/imprint/imprint.service";
import { ExamService } from "../../../../../core/exam/exam.service";
import {Chart, ChartOptions, registerables} from "chart.js";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CommonModule, NgClass, NgForOf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import {ApexOptions, NgApexchartsModule} from "ng-apexcharts";
import { MatTabsModule } from "@angular/material/tabs";
import {CompanyService} from "../../../../../core/company/company.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";

Chart.register(...registerables);

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
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
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatCardModule
    ]
})
export class DetailsComponent implements AfterViewInit, OnInit {

    imprints$: Observable<any[]>;
    imprints: any[] = [];
    examDetails$: Observable<any>;
    infosDetailsCompany: any;
    imprintStats$: Observable<any[]>;
    imprintsValues: number[] = [];
    imprintStats: any[] = [];
    cci: number;
    imprintsNames: string[] = [];
    companyName: string = '';
    categories = [
        {
            name: 'Personal relationship',
            statuses: ['green star', 'green star', 'green star', 'green star', 'green star', 'green star', 'green star']
        },
        { name: 'Stay in family', statuses: ['green', 'green', 'green', 'gray', 'gray', 'green star', 'green star'] },
        {
            name: 'Member of a local association',
            statuses: ['green', 'green', 'green', 'gray', 'gray', 'green star', 'green star']
        },
        {
            name: 'Member of an association',
            statuses: ['green star', 'green star', 'green star', 'green star', 'gray', 'green star', 'green star']
        },
        {
            name: 'Contribute to the well-being',
            statuses: ['red', 'red', 'red', 'gray', 'gray', 'green star', 'green star']
        }
    ];

    progress = 80;
    urlCertificat: string = environment.apiFile + '/certificats/imprints-fusion/';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoading = true;
    private dataLoaded = new BehaviorSubject<boolean>(false);
    public chartOptions: ApexOptions;
    public chartOptionsEvolution: ApexOptions;
    displayedSeries: any[];
    indexSeries: any[];
    selectedSeries: any[];
    displayedSeriesEvolution: any[];
    indexSeriesEvolution: any[];
    selectedSeriesEvolution: any[];

    constructor(private _imprintService: ImprintService, private _examService: ExamService, private cd: ChangeDetectorRef, private _companyService: CompanyService) { }

    ngOnInit() {
        this.urlCertificat = this.urlCertificat + this._examService.idExam + ".pdf";

        this.imprints$ = this._imprintService.imprints$;
        this.examDetails$ = this._imprintService.examDetails$;
        this.imprintStats$ = this._imprintService.imprintStatistics$;


        this._imprintService.imprintsValues$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({next: (value) => {
                    this.imprintsValues = value.reverse();
                    this.cci = value.reduce((sum, value) => sum + value, 0);
            }});

        this.imprintStats$.pipe(
            tap(value => {
                this.imprintStats = value;
            })
        ).subscribe();

        this._imprintService.infosImprintDetailsCompany$.pipe(
            tap(value => {
                this.infosDetailsCompany = value;

                this.dataLoaded.next(true); // Déclencher l'événement une fois que les données sont chargées
            })
        ).subscribe();
        this.dataLoaded.pipe(
            filter(loaded => loaded),
            switchMap(() => combineLatest([this.imprints$, this.imprintStats$])),
            tap(([imprints, imprintStats]) => {
                this.imprints = imprints;
                this.imprintStats = imprintStats;

                // Utilisez ChangeDetectorRef pour forcer une vérification des changements
                this.cd.detectChanges();
                this.renderChart(imprintStats);
                this.renderChartEvolution(this.infosDetailsCompany.indexValues, this.infosDetailsCompany.imprintsData);
            })
        ).subscribe();
    }

    ngAfterViewInit() {
        // Assurez-vous que les données sont chargées avant d'appeler renderChartEvolution

    }

    renderChart(datas: any[]) {
        let min: number[] = [];
        let max: number[] = [];
        let moy: number[] = [];
        let labels: string[] = [];

        datas.forEach(value => {
            labels.push(value.imprint);
            min.push(value.minValue);
            max.push(value.maxValue);
            moy.push(value.averageValue);
        });
        this.imprintsNames = labels;
        let series = [
            {
                name: "Min",
                data: min
            },
            {
                name: "Moy",
                data: moy
            },
            {
                name: "Max",
                data: max
            },
            {
                name: "Current",
                data: this.imprintsValues
            }
        ];
        this.indexSeries = series;
        this.selectedSeries = this.indexSeries.map(serie => serie.name);
        this.updateDisplayedSeries();
        this.chartOptions = {
            series: series,
            chart: {
                height: 350,
                type: "line"
            },
            xaxis: {
                categories: labels
            },
            yaxis: {
                min: 0
            },
            title: {
                text: "Imprint Assessments"
            }
        };
        console.log(this.chartOptions)
    }

    renderChartEvolution(index: any[], imprintsData: any[]) {
        const labels = index.map(data => data.date);
        const indexValues = index.map(data => data.value);
        const series = [{
            name: "Index",
            data: indexValues
        }];
        const colors = ['#FF4560', '#00E396', '#008FFB', '#FEB019', '#775DD0'];

        imprintsData.forEach((imprintData, i) => {
            const imprintValues = imprintData.map(data => data.value);
            series.push({
                name: this.imprintsNames[i],
                data: imprintValues
            });
        });
        this.indexSeriesEvolution = series;
        this.selectedSeriesEvolution = this.indexSeriesEvolution.map(serie => serie.name);
        this.updateDisplayedSeriesEvolution();
        this.chartOptionsEvolution = {
            series: series,
            chart: {
                type: "line",
                height: 350
            },
            xaxis: {
                categories: labels
            },
            yaxis: {
                min: 0
            },
            colors: colors,
            title: {
                text: "Index and imprint evolution"
            }
        };
    }

    updateDisplayedSeries() {
        this.displayedSeries = this.indexSeries.filter(serie => this.selectedSeries.includes(serie.name));
    }

    updateDisplayedSeriesEvolution() {
        this.displayedSeriesEvolution = this.indexSeriesEvolution.filter(serie => this.selectedSeriesEvolution.includes(serie.name));
    }

    toArray(value) {
        return Array(value).fill(0)
    }

    indexIsAvalaible() {
        return this.imprints.every(value => value.isAvailable);
    }
}
