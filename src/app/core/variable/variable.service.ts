import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Program} from "../program/program.types";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VariableService {

    path = "/variable"

    private _variables: ReplaySubject<any[]> = new ReplaySubject<any[]>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    get variables$(): ReplaySubject<any[]> {
        return this._variables;
    }

    set variables$(value: ReplaySubject<any[]>) {
        this._variables = value;
    }

    getVariables(institutionId, isoCode): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.api + this.path + '/weight/' + institutionId + '/' + isoCode).pipe(
            tap((response: any) => {
                this._variables.next(response);
            }),
        );
    }


}
