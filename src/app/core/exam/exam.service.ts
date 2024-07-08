import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, ReplaySubject, tap} from "rxjs";
import {Profil} from "../profil/profil.types";
import {Exam} from "./exam.types";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ExamService {

    pathExam = '/exam'
    private _idExam: string;

    private _exams: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    private _exam: ReplaySubject<Exam> = new ReplaySubject<Exam>();
    private _examDetails: ReplaySubject<any> = new ReplaySubject<any>();
    private _indiceAvailable: Boolean;
    constructor(private _httpClient: HttpClient) { }

    set exam(exam: Exam) {
        this._exam.next(exam)
    }
    get exam$(): Observable<Exam> {
        return this._exam.asObservable();
    }
    get examDetails$(): Observable<any> {
        return this._examDetails.asObservable();
    }
    get exams$(): Observable<any[]> {
        return this._exams.asObservable();
    }

    get indiceAvailable$(){
        return this._indiceAvailable;
    }

    get idExam(): string {
        return this._idExam;
    }

    set idExam(value: string) {
        this._idExam = value;
    }
    createExam(exam) : Observable<any> {
        return this._httpClient.post<Exam>(environment.api + this.pathExam + '/create', exam);
    }

    getPersonExam(personId): Observable<any[]> {
        return this._httpClient.get<any>(environment.api + this.pathExam  + '/' + personId).pipe(
            tap((response) => {
                this._exams.next(response);
            })
        )
    }

    getExamById(examId): Observable<any> {
        this.idExam = examId;
        return this._httpClient.get<any>(environment.api + this.pathExam  + '/details/' + examId).pipe(
            tap((response) => {
                this._examDetails.next(response);

            })
        )
    }



}
