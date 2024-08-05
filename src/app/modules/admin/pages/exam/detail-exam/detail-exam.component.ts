import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {CommonModule, NgClass, NgForOf} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {NgApexchartsModule} from "ng-apexcharts";
import { Chart, registerables } from 'chart.js';
import {MatTabsModule} from "@angular/material/tabs";
import {Observable, Subscription, tap} from "rxjs";
import {ImprintService} from "../../../../../core/imprint/imprint.service";
import {ExamService} from "../../../../../core/exam/exam.service";
import {environment} from "../../../../../../environments/environment";
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink} from "@angular/router";

Chart.register(...registerables);


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
        RouterLink
    ]
})
export class DetailExamComponent implements AfterViewInit, OnInit {

    imprints$: Observable<any[]>;
    imprints: any[];
    examDetails$: Observable<any>;
    examScore$: Observable<number>;
    imprintStats$: Observable<any[]>;
    imprintsValues$: Subscription;
    imprintsValues: number[];
    imprintStats: any[];
    examDetails: any;

    // inclusive confidence index
    cci: number;
    idExam: string;
    categories = [
        { name: 'Personal relationship', statuses: ['green star', 'green star', 'green star', 'green star', 'green star', 'green star', 'green star'] },
        { name: 'Stay in family', statuses: ['green', 'green', 'green', 'gray', 'gray', 'green star', 'green star'] },
        { name: 'Member of a local association', statuses: ['green', 'green', 'green', 'gray', 'gray', 'green star', 'green star'] },
        { name: 'Member of an association', statuses: ['green star', 'green star', 'green star', 'green star', 'gray', 'green star', 'green star'] },
        { name: 'Contribute to the well-being', statuses: ['red', 'red', 'red', 'gray', 'gray', 'green star', 'green star'] }
    ];


    progress = 80;
    urlCertificat: string = environment.apiFile+'/certificats/imprints-fusion/';
    examId: string;
    loadingExam = true;
    loadingImprints = true;
    loadingImprintsValue = true;
    loadingStatistiques = true;
    indexIsAvalaible = false;

    constructor(
        private _imprintService: ImprintService,
        private _examService: ExamService,
        private router: Router,
        private route: ActivatedRoute,) {
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.urlCertificat = this.urlCertificat + id + ".pdf";
        this.examId = id
        //this.examScore$ = this._imprintService.indexScore$;


        this.urlCertificat = `${this._examService.idExam}.pdf`;
        this.examId = this._examService.idExam;

        this.examDetails$ = this._examService.getExamById(id).pipe(
            tap((value) => {
                this.examDetails = value;
                this.loadingExam = true
            }),
            tap(exam => {
                this.examDetails = exam;
                this.loadingExam = false;
            })
        );

        this.imprints$ = this._imprintService.getImprintsByExam(id).pipe(
            tap(() => this.loadingImprints = true),
            tap(imprints => {
                this.imprints = imprints;
                console.log(imprints)
                this.indexIsAvalaible = this.imprints.every(value => value.isAvailable);
                this.loadingImprints = false;
            })
        );

        this._imprintService.getStatistics().pipe(
            tap(() => this.loadingStatistiques = true),
            tap(stats => {
                this.imprintStats = stats;
                console.log(stats);
                this.renderChart(this.imprintStats);
            })
        ).subscribe({
            next: () => this.loadingStatistiques = false,
            error: () => this.loadingStatistiques = false
        });

        this.imprintsValues$ = this._imprintService.getImprintsValues(id).pipe(
            tap(() => this.loadingImprintsValue = true),
            tap(values => {
                this.imprintsValues = values;
                console.log('imprintvalues', values);
                this.cci = values.reduce((sum, value) => sum + value, 0);
            })
        ).subscribe({
            next: () => this.loadingImprintsValue = false,
            error: () => this.loadingImprintsValue = false
        });
    }

    ngAfterViewInit() {

    }

    renderChart(datas: any[]) {
        const ctx = document.getElementById('assessmentChart') as HTMLCanvasElement;
        let min = [];
        let max = [];
        let moy = [];
        let current = [];
        let labels = [];
        datas.forEach(value => {
            labels.push(value.imprint);
            min.push(value.minValue);
            max.push(value.maxValue);
            moy.push(value.averageValue);
        });
        //this.imprintsValues.reverse();
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Min',
                        data: min,
                        borderColor: 'red',
                        fill: false,
                    },
                    {
                        label: 'Moy',
                        data: moy,
                        borderColor: 'black',
                        borderDash: [5, 5],
                        fill: false,
                    },
                    {
                        label: 'Max',
                        data: max,
                        borderColor: 'green',
                        fill: false,
                    },
                    {
                        label: 'Current',
                        data: this.imprintsValues,
                        borderColor: 'orange',
                        pointRadius: 5,
                        pointBackgroundColor: 'orange',
                        fill: false,
                    }
                ]
            },
            options: {
                responsive: true,
                /*animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear',
                        from: 1,
                        to: 0,
                        loop: true
                    }
                },*/
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    toArray(value) {
        return Array(value).fill(0)
    }


    completedAssessment() {
        this.router.navigate(['/assessment/complete/'+this.examId])
    }
}
