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

    private _exams: ReplaySubject<Exam[]> = new ReplaySubject<Exam[]>();
    private _exam: ReplaySubject<Exam> = new ReplaySubject<Exam>();
    private _indiceAvailable: Boolean;
    constructor(private _httpClient: HttpClient) { }

    set exam(exam: Exam) {
        this._exam.next(exam)
    }
    get exam$(): Observable<Exam> {
        return this._exam.asObservable();
    }
    get exams$(): Observable<Exam[]> {
        return this._exams.asObservable();
    }

    get indiceAvailable$(){
        return this._indiceAvailable;
    }

    createExam(exam) : Observable<any> {
        return this._httpClient.post<Exam>(environment.api + this.pathExam + '/create', exam).pipe(
            map((response) => {
                this.exam = response;
            }),
        )
    }

    getPersonExam(personId): Observable<Exam[]> {
        return this._httpClient.get<any>(environment.api + this.pathExam  + '/' + personId).pipe(
            tap((response) => {
                this._exams.next(response.exams);
                this._indiceAvailable = response.indiceAvailable
                console.log(this._indiceAvailable)
            })
        )
    }


}
