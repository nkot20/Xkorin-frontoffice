import { Injectable } from '@angular/core';
import {ReplaySubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ImprintInstitution} from "./imprint-institution.types";

@Injectable({
  providedIn: 'root'
})
export class ImprintInstitutionService {

    path = "/imprint-institution"

    private _imprintInstitutions: ReplaySubject<ImprintInstitution[]> = new ReplaySubject<ImprintInstitution[]>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    save(payload) {
        return this._httpClient.post(environment.api + this.path + '/create', payload)
    }

    getImprintsByInstitution(institutionId) {
        return this._httpClient.get(environment.api + this.path + '/imprint-institution/' + institutionId)
    }
}
