import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {StateService} from "../state/state.service";
import {CompanyService} from "../company/company.service";

@Injectable({
  providedIn: 'root'
})
export class ImprintService {

    private imprintPath = '/imprint';

    private _imprints: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    private _indexScore: ReplaySubject<number> = new ReplaySubject<number>();
    private _imprintStatistics: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    private _imprintsValues: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    private _infosImprintDetailsCompanyAssessment: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    private _examDetails: ReplaySubject<any> = new ReplaySubject<any>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _stateService: StateService, private _companyService: CompanyService)
    {
    }

    get imprints$(): Observable<any[]> {
        return this._imprints.asObservable();
    }

    get indexScore$(): Observable<number> {
        return this._indexScore.asObservable();
    }

    get imprintStatistics$(): Observable<any[]> {
        return this._imprintStatistics.asObservable();
    }

    get imprintsValues$(): Observable<any[]> {
        return this._imprintsValues.asObservable();
    }


    get infosImprintDetailsCompany$(): ReplaySubject<any[]> {
        return this._infosImprintDetailsCompanyAssessment;
    }

    set infosImprintDetailsCompany$(value: ReplaySubject<any[]>) {
        this._infosImprintDetailsCompanyAssessment = value;
    }


    get examDetails$(): ReplaySubject<any> {
        return this._examDetails;
    }

    set examDetails$(value: ReplaySubject<any>) {
        this._examDetails = value;
    }

    getImprintsWithVariables(profilId, subcategoryId, isoCode): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.api + this.imprintPath + '/variable-questions/' + profilId + '/' +subcategoryId + '/' + isoCode).pipe(
            tap((response: any) => {

                this._stateService.setData(response);

                this._imprints.next(response);
            }),
        );
    }

    getImprintsByExam(examId): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.api + this.imprintPath + '/dashboard/' + examId).pipe(
            tap((response: any[]) => {
                response = response.sort((a, b) => {
                    if (a.imprint.number > b.imprint.number)
                        return 1;
                    else
                        return -1;
                });

                this._imprints.next(response);
            }),
        );
    }

    getRemainingVariablesForImprints(profilId, subcategoryId, isoCode, examId) {
        console.log(profilId, subcategoryId)
        return this._httpClient.get<any[]>(environment.api + this.imprintPath + '/remaining-variables/' + profilId + '/' +subcategoryId + '/' + isoCode + '/' + examId).pipe(
            tap((response: any) => {
                this._stateService.setData(response);
                this._imprints.next(response);
            }),
        );
    }

    getExamIndex(examId): Observable<any> {
        return this._httpClient.get<any>(environment.api + this.imprintPath  + '/cii/' + examId).pipe(
            tap((response) => {
                this._indexScore.next(response.score);

            })
        )
    }

    getStatistics(): Observable<any> {
        return this._httpClient.get<any>(environment.api + this.imprintPath  + '/statistics').pipe(
            tap((response) => {
                this._imprintStatistics.next(response);

            })
        )
    }

    getImprintsValues(examId): Observable<any> {
        return this._httpClient.get<any>(environment.api + this.imprintPath  + '/imprints-values/' + examId).pipe(
            tap((response) => {
                this._imprintsValues.next(response);

            })
        )
    }

    getImprints(): Observable<any> {
        return this._httpClient.get<any>(environment.api + this.imprintPath  + '/list').pipe(
            tap((response) => {
                this._imprints.next(response);

            })
        )
    }

    getImprintsValuesDetailsCompanies(institutionId, personId): Observable<any> {
        return this._httpClient.get<any>(environment.api + this.imprintPath + '/'  + institutionId + '/evolution/' + personId).pipe(
            tap((response) => {
                this._imprintsValues.next(response.imprintValue);
                this._imprints.next(response.variableTree);
                this._infosImprintDetailsCompanyAssessment.next(response.evolution);
                this._examDetails.next(response.examDetails);
                this._companyService.companies.next(response.company)
            })
        )
    }

    getImprintsValuesEvolutionOfPerson(personId): Observable<any> {
        return this._httpClient.get<any>(environment.api + this.imprintPath + '/evolution/' + personId).pipe(
            tap((response) => {
                this._imprintsValues.next(response.imprintValue);
                this._imprints.next(response.variableTree);
                this._infosImprintDetailsCompanyAssessment.next(response.evolution);
                this._examDetails.next(response.examDetails);
            })
        )
    }
}
