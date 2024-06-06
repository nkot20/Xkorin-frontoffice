import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { ScrumboardBoardComponent } from 'app/modules/admin/apps/scrumboard/board/board.component';
import { ScrumboardBoardsComponent } from 'app/modules/admin/apps/scrumboard/boards/boards.component';
import { ScrumboardCardComponent } from 'app/modules/admin/apps/scrumboard/card/card.component';
import { Board } from 'app/modules/admin/apps/scrumboard/scrumboard.models';
import { ScrumboardService } from 'app/modules/admin/apps/scrumboard/scrumboard.service';
import { catchError, Observable, throwError } from 'rxjs';
import {ExamService} from "./exam.service";
import {ExamComponent} from "./exam.component";
import {ExamsComponent} from "./exams/exams.component";


export default [
    {
        path     : '',
        component: ExamsComponent,
        resolve  : {
            boards: () => inject(ExamService).getExams(),
        },
    },
] as Routes;
