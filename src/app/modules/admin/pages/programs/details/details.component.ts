import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import {ProgramService} from "../../../../../core/program/program.service";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {map, merge, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {Program} from "../../../../../core/program/program.types";
import {FormsModule, ReactiveFormsModule, UntypedFormControl} from "@angular/forms";
import {Pagination} from "../../../../../core/pagination/Pagination";
import {ActivatedRoute, ActivatedRouteSnapshot, RouterLink} from "@angular/router";
import {AsyncPipe, CurrencyPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSelectModule} from "@angular/material/select";

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    imports: [
        NgIf,
        AsyncPipe,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSortModule,
        NgForOf,
        NgTemplateOutlet,
        ReactiveFormsModule,
        NgClass,
        RouterLink,
        CurrencyPipe
    ],
    standalone: true
})
export class DetailsComponent implements OnInit, AfterViewInit{

    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) _sort: MatSort;
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    pagination: Pagination;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;

    program$: Observable<Program>;
    participants$: Observable<any[]>;
    currentPage: number = 1;
    totalPages: number = 0;
    isLoadingProgram: boolean = true;
    programId: string = "";
    isLoadingParticipants: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    skeletonArray = Array(10);  // Utilisé pour afficher 10 skeletons pendant le chargement
    snapshot: ActivatedRouteSnapshot;

    constructor(
        private _programService: ProgramService,
        private _router: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
         this.snapshot = _router.snapshot
    }

    ngOnInit(): void {
        this.programId = this.snapshot.paramMap.get('id');
        this.program$ = this._programService.program$;
        this.getDatas();

    }


    getDatas () {
        // Get the pagination

        this._programService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: any) => {
                this.pagination = pagination;

                this._changeDetectorRef.markForCheck();
            });

        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>
                    // Search
                    this._programService.getProgramsParticipants(0, 10, 'creation_date', 'asc', query, this.programId),
                ),
            )
            .subscribe();
        this._programService.getProgramsParticipants(0, 10,'creation_date', 'asc', '', this.programId).subscribe(value => {
            this.participants$ = this._programService.participants$;
            console.log(value)
        })

    }

    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {

            // Set the initial sort
            this._sort.sort({
                id: 'company_name',
                start: 'asc',
                disableClear: true
            });

            this._changeDetectorRef.markForCheck();

            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 1;
                });
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.isLoading = true;

                    return this._programService.getProgramsParticipants(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction, '', this.programId);
                }),
                map(() => {
                    //this.showFlashMessage('success');
                    this.isLoading = false;
                })
            ).subscribe();
        }

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
