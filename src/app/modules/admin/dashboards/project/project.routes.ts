import { inject } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import { ProjectComponent } from 'app/modules/admin/dashboards/project/project.component';
import { ProjectService } from 'app/modules/admin/dashboards/project/project.service';
import {ImprintService} from "../../../../core/imprint/imprint.service";
import {UserService} from "../../../../core/user/user.service";
import {catchError, throwError} from "rxjs";


const examImprintsCompanieDetailsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const imprintService =  inject(ImprintService);
    const userService = inject(UserService);
    const router = inject(Router);
    const id = route.paramMap.get('id');
    const user = userService.userValue
    return imprintService.getImprintsValuesDetailsCompanies(user.institution._id, id).pipe(
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
        component: ProjectComponent,
        resolve  : {
            data: () => inject(ProjectService).getData(),
            //details: examImprintsCompanieDetailsResolver,
            //statistiques: statisticsImprintResolver,
        },
    },
] as Routes;
