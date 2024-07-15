import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Institution} from "./institution.type";
import {Profil} from "../profil/profil.types";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

    pathInstitution = '/institution'

    private _institutions: ReplaySubject<Institution[]> = new ReplaySubject<Institution[]>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    get institutions$(): Observable<Institution[]> {
        return this._institutions.asObservable();
    }

    getInstitutions(): Observable<Institution[]> {
        return this._httpClient.get<Institution[]>(environment.api + this.pathInstitution).pipe(
            tap((response: any) => {
                this._institutions.next(response);
            }),
        );
    }

    updateInstitutionAfterFirstInscription(userId, institutionId, data): Observable<any> {
        return this._httpClient.patch<Institution>(environment.api + this.pathInstitution + '/update-first-login/' + institutionId + '/user/' + userId, data);
    }
}
