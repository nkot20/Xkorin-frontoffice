import { CdkScrollable } from '@angular/cdk/scrolling';
import {DatePipe, NgFor, NgIf} from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import { Board } from 'app/modules/admin/apps/scrumboard/scrumboard.models';
import { ScrumboardService } from 'app/modules/admin/apps/scrumboard/scrumboard.service';
import { DateTime } from 'luxon';
import { Subject, takeUntil } from 'rxjs';
import {ExamService} from "../../../../../core/exam/exam.service";
import {Exam} from "../../../../../core/exam/exam.types";

@Component({
    selector       : 'scrumboard-boards',
    templateUrl    : './exams.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [CdkScrollable, NgFor, RouterLink, MatIconModule, NgIf, DatePipe],
})
export class ExamsComponent implements OnInit, OnDestroy
{
    exams: any[];

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isAvailable: Boolean = true;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _examService: ExamService,
        private router: Router,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the boards
        this._examService.exams$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((exams: any[]) =>
            {
                this.exams = exams;
                this.isAvailable = this._examService.indiceAvailable$;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        console.log(this.isAvailable)
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Format the given ISO_8601 date as a relative date
     *
     * @param date
     */
    formatDateAsRelative(date: string): string
    {
        return DateTime.fromISO(date).toRelative();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    onGoToNewExam() {
        this.router.navigate(['/assessment/new'])
    }
}
