import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {map, merge, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {ReactiveFormsModule, UntypedFormControl} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {Pagination} from "../../../../../core/pagination/Pagination";
import {CompanyService} from "../../../../../core/company/company.service";
import {UserService} from "../../../../../core/user/user.service";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    imports: [
        MatProgressBarModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        AsyncPipe,
        MatSortModule,
        MatPaginatorModule,
        NgClass,
        NgIf
    ],
    standalone: true
})
export class ListComponent implements AfterViewInit, OnDestroy, OnInit{
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) _sort: MatSort;
    institutionId: string;


    displayedColumns: string[] = ['Company name', 'Company email', 'Company promoter name', 'Promoter email', 'Country', 'Action'];

    pagination: Pagination;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    companies$: Observable<any[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _liveAnnouncer: LiveAnnouncer,
        private _companiesService: CompanyService,
        private _userService: UserService
    ) {
    }

    ngOnInit() {
        this.institutionId = localStorage.getItem('%institution%');
        this._companiesService.pagination
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: any) => {
                this.pagination = pagination;
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>
                    // Search
                    this._companiesService.getCompanies(0, 10, 'creation_date', 'asc', query, this.institutionId),
                ),
            )
            .subscribe();
        this.companies$ = this._companiesService.companies;
    }

    ngAfterViewInit(): void
    {
        if (this._sort && this._paginator) {

            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true,
            });

            this._changeDetectorRef.markForCheck();

            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() =>
                {
                    // Reset back to the first page
                    this._paginator.pageIndex = 1;
                });

            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() =>
                {
                    this.isLoading = true;

                    return this._companiesService.getCompanies(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction, "", this.institutionId);
                }),
                map(() =>
                {
                    this.showFlashMessage('success');
                    this.isLoading = false;
                }),
            ).subscribe();
        }
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() =>
        {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }
}
