import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { ScrumboardBoardComponent } from 'app/modules/admin/apps/scrumboard/board/board.component';
import { ScrumboardBoardsComponent } from 'app/modules/admin/apps/scrumboard/boards/boards.component';
import { ScrumboardCardComponent } from 'app/modules/admin/apps/scrumboard/card/card.component';
import { Board } from 'app/modules/admin/apps/scrumboard/scrumboard.models';
import { ScrumboardService } from 'app/modules/admin/apps/scrumboard/scrumboard.service';
import { catchError, Observable, throwError } from 'rxjs';
import {ExamComponent} from "./exam.component";
import {ExamsComponent} from "./exams/exams.component";
import {ImprintService} from "../../../../core/imprint/imprint.service";
import {UserService} from "../../../../core/user/user.service";
import {TranslocoService} from "@ngneat/transloco";
import {ExamService} from "../../../../core/exam/exam.service";
import {DetailExamComponent} from "./detail-exam/detail-exam.component";

const examsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const examService = inject(ExamService);
    const userService = inject(UserService);
    const router = inject(Router);
    const user = userService.userValue
    return examService.getPersonExam(user.person._id).pipe(
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
const imprintsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const imprintService =  inject(ImprintService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    return imprintService.getImprintsByExam(id).pipe(
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

const examDetailsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const examService =  inject(ExamService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    return examService.getExamById(id).pipe(
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

const examScoreResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const imprintService =  inject(ImprintService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    return imprintService.getExamIndex(id).pipe(
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

const examImprintsValuesResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const imprintService =  inject(ImprintService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    return imprintService.getImprintsValues(id).pipe(
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
        component: ExamsComponent,
        resolve  : {
            //boards: examsResolver
        },
    },
    {
        path: 'details/:id',
        component: DetailExamComponent,
        resolve: {
            //imprints: imprintsResolver,
            //exam: examDetailsResolver,
            //score: examScoreResolver,
            //statistiques: statisticsImprintResolver,
            //imprintsValue: examImprintsValuesResolver
        }
    }
] as Routes;
