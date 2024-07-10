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
import {Observable} from "rxjs";
import {ImprintService} from "../../../../../core/imprint/imprint.service";
import {ExamService} from "../../../../../core/exam/exam.service";

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
        MatTabsModule
    ]
})
export class DetailExamComponent implements AfterViewInit, OnInit {

    imprints$: Observable<any[]>;
    imprints: any[];
    examDetails$: Observable<any>;
    examScore$: Observable<number>;
    imprintStats$: Observable<any[]>;
    imprintsValues: number[];
    imprintStats: any[];
    // inclusive confidence index
    cci: number;
    categories = [
        { name: 'Personal relationship', statuses: ['green star', 'green star', 'green star', 'green star', 'green star', 'green star', 'green star'] },
        { name: 'Stay in family', statuses: ['green', 'green', 'green', 'gray', 'gray', 'green star', 'green star'] },
        { name: 'Member of a local association', statuses: ['green', 'green', 'green', 'gray', 'gray', 'green star', 'green star'] },
        { name: 'Member of an association', statuses: ['green star', 'green star', 'green star', 'green star', 'gray', 'green star', 'green star'] },
        { name: 'Contribute to the well-being', statuses: ['red', 'red', 'red', 'gray', 'gray', 'green star', 'green star'] }
    ];


    progress = 80;

    constructor(private _imprintService: ImprintService, private _examService: ExamService) {
    }

    ngOnInit() {
        this.imprints$ = this._imprintService.imprints$;
        this.imprints$.subscribe(value => {
            this.imprints = value;
        })
        this.examDetails$ = this._examService.examDetails$;
        //this.examScore$ = this._imprintService.indexScore$;
        this.imprintStats$ = this._imprintService.imprintStatistics$;
        this.imprintStats$.subscribe(value => {
            this.imprintStats = value;
        });
        this._imprintService.imprintsValues$.subscribe(value => {
            this.imprintsValues = value.reverse();
            this.cci = value.reduce((sum, value) => sum + value, 0);
        })
    }

    ngAfterViewInit() {
        this.renderChart(this.imprintStats);
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
        })
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
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear',
                        from: 1,
                        to: 0,
                        loop: true
                    }
                },
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

    indexIsAvalaible() {
        return this.imprints.every(value => value.isAvailable);
    }
}
