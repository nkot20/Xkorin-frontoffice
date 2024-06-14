import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Profil} from "./profil.types";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

    pathProfil = '/profil'

    private _profils: ReplaySubject<Profil[]> = new ReplaySubject<Profil[]>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    get profils$(): Observable<Profil[]> {
        return this._profils.asObservable();
    }

    getProfils(isoCode): Observable<Profil[]> {
        return this._httpClient.get<Profil[]>(environment.api + this.pathProfil + '/' + isoCode).pipe(
            tap((response: any) => {
                this._profils.next(response);
            }),
        );
    }
}
