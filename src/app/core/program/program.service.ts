import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, tap} from "rxjs";
import {Profil} from "../profil/profil.types";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Program} from "./program.types";

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

    pathProgram = '/program'

    private _programs: ReplaySubject<Program[]> = new ReplaySubject<Program[]>();
    private _pagination: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    get programs$(): Observable<Program[]> {
        return this._programs.asObservable();
    }

    get pagination$(): BehaviorSubject<any> {
        return this._pagination;
    }

    set pagination$(value: BehaviorSubject<any>) {
        this._pagination = value;
    }

    getProgramsByInstitutionId(page: number = 0, size: number = 10, sort: string = 'creation_date', order: 'asc' | 'desc' | '' = 'asc', search: string = '', institutionId): Observable<Program[]> {
        return this._httpClient.get<Program[]>(environment.api + this.pathProgram + '/' + institutionId, {
            params: {
                page: page,
                limit: size,
                sort,
                order,
                search,
            }
        }).pipe(
            tap((response: any) => {
                this._programs.next(response.programs);
                this._pagination.next(response.pagination);
            }),
        );
    }

    getProgramsByInstitutionIdWithoutPagination(institutionId): Observable<Program[]> {
        return this._httpClient.get<Program[]>(environment.api + this.pathProgram + '/' + institutionId + '/no-pagination').pipe(
            tap((response: any) => {
                this._programs.next(response);
            }),
        );
    }

    getAllPrograms(): Observable<Program[]> {
        return this._httpClient.get<Program[]>(environment.api + this.pathProgram).pipe(
            tap((response: any) => {
                this._programs.next(response);
            }),
        );
    }

    createProgram(payload): Observable<Program> {
        return this._httpClient.post<Program>(environment.api + this.pathProgram + '/create', payload);
    }

    updateProgram(id, payload): Observable<Program> {
        return this._httpClient.patch<Program>(environment.api + this.pathProgram + '/update/' + id, payload);
    }

    archivedProgram(id): Observable<any> {
        return this._httpClient.patch<any>(environment.api + this.pathProgram + '/archived/' + id, null);
    }

    getProgramDetails(id): Observable<Program> {
        return this._httpClient.get<Program>(environment.api + this.pathProgram + '/details/' + id);
    }
}
