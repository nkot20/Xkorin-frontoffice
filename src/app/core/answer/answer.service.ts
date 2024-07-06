import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Exam} from "../exam/exam.types";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

    pathAnswer = '/answer';

    constructor(private _httpClient: HttpClient) { }

    saveAnswer(answer) : Observable<any> {
        return this._httpClient.post<Exam>(environment.api + this.pathAnswer + '/create', answer);
    }
}
