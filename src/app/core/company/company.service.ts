import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Company} from "./company.types";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
    path = "/company";
    private _companies: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    get companies(): BehaviorSubject<any> {
        return this._companies;
    }

    set companies(value: BehaviorSubject<any>) {
        this._companies = value;
    }

    get pagination(): BehaviorSubject<any> {
        return this._pagination;
    }

    set pagination(value: BehaviorSubject<any>) {
        this._pagination = value;
    }

    getCompanies(page: number = 0, size: number = 10, sort: string = 'creation_date', order: 'asc' | 'desc' | '' = 'asc', search: string = '', institutionId): Observable<Company[]> {
        return this._httpClient.get<any>(environment.api + this.path + '/' + institutionId + '/all', {
            params: {
                page: page,
                limit: size,
                sort,
                order,
                search,
            }
        }).pipe(
            tap((response: any) => {
                this._companies.next(response.companies);
                this._pagination.next(response.pagination);
            }),
        );
    }
}
