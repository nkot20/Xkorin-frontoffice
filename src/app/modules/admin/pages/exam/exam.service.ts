import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Board, Card, Label, List } from 'app/modules/admin/apps/scrumboard/scrumboard.models';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import {IExam} from "./exam.types";
import {Exam} from "./exam.models";

@Injectable({providedIn: 'root'})
export class ExamService
{
    // Private
    private _exam: BehaviorSubject<Exam | null>;
    private _exams: BehaviorSubject<Exam[] | null>;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
    )
    {
        // Set the private defaults
        this._exam = new BehaviorSubject(null);
        this._exams = new BehaviorSubject(null);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for board
     */
    get exam$(): Observable<Exam>
    {
        return this._exam.asObservable();
    }

    /**
     * Getter for boards
     */
    get exams$(): Observable<Exam[]>
    {
        return this._exams.asObservable();
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get exams
     */
    getExams(): Observable<Exam[]>
    {
       /* return this._httpClient.get<Exam[]>('api/apps/scrumboard/boards').pipe(
            map(response => response.map(item => new Exam(item))),
            tap(exams => this._exams.next(exams)),
        );*/
        let exams: Exam[] = [];
        let exam: IExam = {
            id: 'mqlkejk5fds5',
            reason: 'Financing',
            date: '06/06/2024'
        };
        const newExam = new Exam(exam);
        exams.push(newExam);
        this._exams.next(exams);
        return this.exams$;
    }

    /**
     * Get exam
     *
     * @param id
     */
    getExam(id: string): Observable<Exam>
    {
        return this._httpClient.get<Exam>('api/apps/scrumboard/board', {params: {id}}).pipe(
            map(response => new Exam(response)),
            tap(exam => this._exam.next(exam)),
        );
    }

    /**
     * Create exam
     *
     * @param exam
     */
    createBoard(exam: Exam): Observable<Exam>
    {
        return this.exams$.pipe(
            take(1),
            switchMap(exams => this._httpClient.put<Exam>('api/apps/scrumboard/board', {exam}).pipe(
                map((newExam) =>
                {
                    // Update the boards with the new board
                    this._exams.next([...exams, newExam]);

                    // Return new board from observable
                    return newExam;
                }),
            )),
        );
    }


    /**
     * Search within board cards
     *
     * @param query
     */
    search(query: string): Observable<Card[] | null>
    {
        // @TODO: Update the board cards based on the search results
        return this._httpClient.get<Card[] | null>('api/apps/scrumboard/board/search', {params: {query}});
    }
}
