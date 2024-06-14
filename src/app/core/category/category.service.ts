import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Category} from "./category.types";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

    pathCategory = '/category'

    private _category: ReplaySubject<Category> = new ReplaySubject<Category>(1);
    private _categories: ReplaySubject<Category[]> = new ReplaySubject<Category[]>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    set category(value: Category)
    {

        // Store the value
        this._category.next(value);
    }

    get category$(): Observable<Category>
    {
        return this._category.asObservable();
    }


    get categories$(): Observable<Category[]> {
        return this._categories.asObservable();
    }

    getCategoriesByLanguage(isoCode): Observable<Category[]> {
        return this._httpClient.get<Category[]>(environment.api + this.pathCategory + '/' + isoCode).pipe(
            tap((response: any) => {
                console.log(response)
                this._categories.next(response);
            }),
        );
    }
}
