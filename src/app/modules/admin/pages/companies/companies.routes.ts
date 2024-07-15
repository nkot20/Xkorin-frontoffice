import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import { MaintenanceComponent } from 'app/modules/admin/pages/maintenance/maintenance.component';
import {CompaniesComponent} from "./companies.component";
import {inject} from "@angular/core";
import {ExamService} from "../../../../core/exam/exam.service";
import {catchError, throwError} from "rxjs";
import {CompanyService} from "../../../../core/company/company.service";
import {ListComponent} from "./list/list.component";
import {ImprintService} from "../../../../core/imprint/imprint.service";
import {DetailsComponent} from "./details/details.component";
import {UserService} from "../../../../core/user/user.service";

const companiesResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const companyService =  inject(CompanyService);
    const router = inject(Router);
    const userService = inject(UserService);
    userService.user$.subscribe(value => {
         return companyService.getCompanies(0, 10,'creation_date', 'asc', '', value.institution._id).pipe(
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
        ).subscribe();
    })

};

const examImprintsCompanieDetailsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const imprintService =  inject(ImprintService);
    const userService = inject(UserService);
    const router = inject(Router);
    const id = route.paramMap.get('id');
    userService.user$.subscribe(value => {
        return imprintService.getImprintsValuesDetailsCompanies(value.institution._id, id).pipe(
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
        ).subscribe();
    })

};

const statisticsImprintResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const imprintService =  inject(ImprintService);
    const router = inject(Router);

    return imprintService.getStatistics().pipe(
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
            companies: companiesResolver
        }
    },
    {
        path     : 'details/:id',
        component: DetailsComponent,
        resolve: {
            details: examImprintsCompanieDetailsResolver,
            statistiques: statisticsImprintResolver,
        }
    },
] as Routes;
