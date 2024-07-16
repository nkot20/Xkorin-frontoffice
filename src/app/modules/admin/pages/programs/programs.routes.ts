import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';
import {inject} from "@angular/core";
import {InstitutionService} from "../../../../core/institution/institution.service";
import {AuthService} from "../../../../core/auth/auth.service";
import {catchError, throwError} from "rxjs";
import {ListComponent} from "./list/list.component";
import {CompanyService} from "../../../../core/company/company.service";
import {UserService} from "../../../../core/user/user.service";
import {ProgramService} from "../../../../core/program/program.service";


const institutionResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const institutionService = inject(InstitutionService);
    const authService = inject(AuthService);
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
const programsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const programService =  inject(ProgramService);
    const router = inject(Router);
    const userService = inject(UserService);
    return programService.getProgramsByInstitutionId(0, 10,'creation_date', 'asc', '', localStorage.getItem('%institution%')).pipe(
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
        component: ListComponent,
        resolve: {
            institutions: institutionResolver,
            programs: programsResolver
        }
    },
] as Routes;
