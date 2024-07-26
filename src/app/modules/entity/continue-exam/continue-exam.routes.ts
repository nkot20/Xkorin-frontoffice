import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import {inject} from "@angular/core"
import {ImprintService} from "../../../core/imprint/imprint.service";
import {UserService} from "../../../core/user/user.service";
import {TranslocoService} from "@ngneat/transloco";
import {catchError, throwError} from "rxjs";
import {InstitutionService} from "../../../core/institution/institution.service";
import {OptionService} from "../../../core/option/option.service";
import {MainImprintComponent} from "./main-imprint/main-imprint.component";
import {AuthService} from "../../../core/auth/auth.service";



const imprintsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const imprintService = inject(ImprintService);
    const userService = inject(UserService);
    const router = inject(Router);
    const translocoService = inject(TranslocoService);
    const authService = inject(AuthService);
    const lang = translocoService.getActiveLang();
    const id = route.paramMap.get('id');
    const user = userService.userValue;
    return imprintService.getRemainingVariablesForImprints(user.person.profil_id[0], user.person.subcategory_id[0], lang, id).pipe(
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

const institutionResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const institutionService = inject(InstitutionService);
    const router = inject(Router);
    return institutionService.getInstitutions().pipe(
        // Error here means the requested institution is not available
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

const optionsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const optionService = inject(OptionService);
    const router = inject(Router);
    const translocoService = inject(TranslocoService)
    const lang = translocoService.getActiveLang()
    return optionService.getOptions(lang).pipe(
        // Error here means the requested institution is not available
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
        path     : ':id',
        component: MainImprintComponent,
        resolve: {
            imprints: imprintsResolver,
            options: optionsResolver
        }
    },
] as Routes;
