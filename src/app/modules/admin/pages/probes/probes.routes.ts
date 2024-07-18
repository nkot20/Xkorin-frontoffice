import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import {inject} from "@angular/core"
import {TranslocoService} from "@ngneat/transloco";
import {catchError, throwError} from "rxjs";
import {OptionService} from "../../../../core/option/option.service";
import {ProbesComponent} from "./probes.component";
import {VariableService} from "../../../../core/variable/variable.service";



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

const variableResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const variableService = inject(VariableService);
    const router = inject(Router);
    const translocoService = inject(TranslocoService)
    const lang = translocoService.getActiveLang();
    const institutionId = localStorage.getItem('%institution%');
    return variableService.getVariables(institutionId, lang).pipe(
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
        path     : '',
        component: ProbesComponent,
        resolve: {
            options: optionsResolver,
            variables: variableResolver
        }
    },
] as Routes;
