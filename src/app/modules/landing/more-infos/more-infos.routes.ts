import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';
import {MoreInfosComponent} from "./more-infos.component";
import {inject} from "@angular/core";
import {ExamService} from "../../../core/exam/exam.service";
import {UserService} from "../../../core/user/user.service";
import {catchError, throwError} from "rxjs";
import {InstitutionService} from "../../../core/institution/institution.service";
import {AuthService} from "../../../core/auth/auth.service";

const institutionResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const institutionService = inject(InstitutionService);
    const authService = inject(AuthService);
    const router = inject(Router);
    
    authService.signInUsingToken().subscribe(value => {

    }, error => {
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    });

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

export default [
    {
        path     : '',
        component: MoreInfosComponent,
        resolve: {
            institutions: institutionResolver,
        }
    },
] as Routes;
