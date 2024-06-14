import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import { AuthSignUpComponent } from 'app/modules/auth/sign-up/sign-up.component';
import {inject} from "@angular/core";
import {CategoryService} from "../../../core/category/category.service";
import {TranslocoService} from "@ngneat/transloco";
import {catchError, throwError} from "rxjs";
import {SubCategoryService} from "../../../core/subCategory/sub-category.service";
import {ProfilService} from "../../../core/profil/profil.service";


const subCategoryResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const categoryService = inject(CategoryService);
    const subCategoryService = inject(SubCategoryService);
    const router = inject(Router);
    const translocoService = inject(TranslocoService)
    const lang = translocoService.getActiveLang()

    const idCategory = localStorage.getItem("smfjskflsssf5489oop")

    return subCategoryService.getSubCategoriesByCategoryAndLanguage(lang, idCategory).pipe(
        // Error here means the requested category is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        }),
    );

};

const profilsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const profilService = inject(ProfilService);
    const router = inject(Router);
    const translocoService = inject(TranslocoService)
    const lang = translocoService.getActiveLang()



    return profilService.getProfils(lang).pipe(
        // Error here means the requested category is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        }),
    );

};

export default [
    {
        path     : '',
        component: AuthSignUpComponent,
        resolve: {
            subcategories: subCategoryResolver,
            profils: profilsResolver
        }
    },
] as Routes;
