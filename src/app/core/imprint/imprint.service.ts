import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ImprintService {

    private imprintPath = '/imprint'

    private _imprints: ReplaySubject<any[]> = new ReplaySubject<any[]>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    get imprints$(): Observable<any[]> {
        return this._imprints.asObservable();
    }

    getImprintsWithVariables(profilId, subcategoryId, isoCode): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.api + this.imprintPath + '/variable-questions/' + profilId + '/' +subcategoryId + '/' + isoCode).pipe(
            tap((response: any) => {

                this._imprints.next(response);
            }),
        );
    }
}
