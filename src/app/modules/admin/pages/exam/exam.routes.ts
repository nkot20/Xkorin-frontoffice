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

const examsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const examService = inject(ExamService);
    const userService = inject(UserService);
    const router = inject(Router);

    return userService.user$.subscribe(user => {
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
        ).subscribe(value => {

        });
    });
};

export default [
    {
        path     : '',
        component: ExamsComponent,
        resolve  : {
            boards: examsResolver
        },
    },
] as Routes;
