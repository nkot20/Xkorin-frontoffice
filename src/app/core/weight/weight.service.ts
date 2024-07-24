import { Injectable } from '@angular/core';
import {ReplaySubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WeightService {

    path = "/weight"

    private _weight: ReplaySubject<any[]> = new ReplaySubject<any[]>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    save(payload) {
        return this._httpClient.post(environment.api + this.path + '/create', payload)
    }
}
