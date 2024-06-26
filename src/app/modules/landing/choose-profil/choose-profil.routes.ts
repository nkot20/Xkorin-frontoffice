import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import {ChooseProfilComponent} from "./choose-profil.component";
import {inject} from "@angular/core";
import {CategoryService} from "../../../core/category/category.service";
import {TranslocoService} from "@ngneat/transloco";
import {catchError, throwError} from "rxjs";

const categoryResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const categoryService = inject(CategoryService);
    const translocoService = inject(TranslocoService)
    const router = inject(Router);
    const lang = translocoService.getActiveLang()

    return categoryService.getCategoriesByLanguage(lang).pipe(
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
        component: ChooseProfilComponent,
        resolve: {
            categories: categoryResolver
        }
    },
] as Routes;
