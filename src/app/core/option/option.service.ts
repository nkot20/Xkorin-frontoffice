import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, tap} from "rxjs";
import {Profil} from "../profil/profil.types";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Option} from "./option.types";

@Injectable({
  providedIn: 'root'
})
export class OptionService {

    pathOption = '/option'

    private _optionsImportant: ReplaySubject<Option[]> = new ReplaySubject<Option[]>();
    private _optionsNotImportant: ReplaySubject<Option[]> = new ReplaySubject<Option[]>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    get optionsImportant$(): Observable<Option[]> {
        return this._optionsImportant.asObservable();
    }

    get optionsNotImportant$(): Observable<Option[]> {
        return this._optionsNotImportant.asObservable();
    }

    getOptions(isoCode): Observable<any> {
        return this._httpClient.get<any>(environment.api + this.pathOption + '/' + isoCode).pipe(
            tap((response: any) => {
                this._optionsNotImportant.next(response.optionsNotImportant);
                this._optionsImportant.next(response.optionsImportant);

            }),
        );
    }
}
