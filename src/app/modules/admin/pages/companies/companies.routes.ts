import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import { MaintenanceComponent } from 'app/modules/admin/pages/maintenance/maintenance.component';
import {CompaniesComponent} from "./companies.component";
import {inject} from "@angular/core";
import {ExamService} from "../../../../core/exam/exam.service";
import {catchError, throwError} from "rxjs";
import {CompanyService} from "../../../../core/company/company.service";

const companiesResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const companyService =  inject(CompanyService);
    const router = inject(Router);

    return companyService.getCompanies(0, 10,'creation_date', 'asc', '', "6675cc8228464981b4cbc539").pipe(
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
        component: CompaniesComponent,
        resolve: {
            companies: companiesResolver
        }
    },
] as Routes;