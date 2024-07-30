import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, tap} from "rxjs";
import {Category} from "../category/category.types";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SubCategory} from "./sub-category.types";

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

    pathSubCategory = '/sub-category'

    private _subCategory: ReplaySubject<SubCategory> = new ReplaySubject<SubCategory>(1);
    private _subCategories: ReplaySubject<SubCategory[]> = new ReplaySubject<SubCategory[]>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    set subCategory(value: SubCategory)
    {
        // Store the value
        this._subCategory.next(value);
    }

    get subCategory$(): Observable<SubCategory>
    {
        return this._subCategory.asObservable();
    }


    get subCategories$(): Observable<SubCategory[]> {
        return this._subCategories.asObservable();
    }

    getSubCategoriesByCategoryAndLanguage(isoCode, idCategory): Observable<SubCategory[]> {
        return this._httpClient.get<SubCategory[]>(environment.api + this.pathSubCategory + '/' + idCategory + '/' +isoCode).pipe(
            tap((response: any) => {
                this._subCategories.next(response);
            }),
        );
    }
}
