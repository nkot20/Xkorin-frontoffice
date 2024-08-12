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
import {UserService} from "../../../../../core/user/user.service";

@Component({
    selector       : 'scrumboard-boards',
    templateUrl    : './exams.component.html',
    styleUrls: ['./exams.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [CdkScrollable, NgFor, RouterLink, MatIconModule, NgIf, DatePipe],
})
export class ExamsComponent implements OnInit, OnDestroy
{
    exams: any[];
    isLoading = true;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isAvailable: Boolean = true;
    examsFinancing = [];
    examsSupport = [];
    examsNotCompleted = [];
    examsAudited = [];
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _examService: ExamService,
        private router: Router,
        private _userService: UserService
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
        const personId = this._userService.userValue.person._id;
        // Get the boards
        this._examService.getPersonExam(personId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({next: (exams: any[]) => {
                this.exams = exams;
                this.examsFinancing = exams.filter(item => item.exam.aim === "Financing");
                this.examsSupport = exams.filter(item => item.exam.aim === "Support");
                this.examsAudited = exams.filter(item => item.exam.audited);
                this.examsNotCompleted = exams.filter(item => !item.exam.indiceAvailable)
                this.isAvailable = this._examService.indiceAvailable$;
                this.isLoading = false; // Stop showing the loader
                this._changeDetectorRef.markForCheck();
            }, error: (error) => {
                this.isLoading = false; // Stop showing the loader even if there's an error
                this._changeDetectorRef.markForCheck();
            }});

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
