import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, inject,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {map, merge, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {Program} from "../../../../../core/program/program.types";
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators
} from "@angular/forms";
import {Pagination} from "../../../../../core/pagination/Pagination";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ProgramService} from "../../../../../core/program/program.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";
import {CdkScrollable} from "@angular/cdk/scrolling";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {AsyncPipe, I18nPluralPipe, NgClass, NgFor, NgIf, NgTemplateOutlet, PercentPipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatButtonModule} from "@angular/material/button";
import {InstitutionService} from "../../../../../core/institution/institution.service";
import {Institution} from "../../../../../core/institution/institution.type";
import {MatDialog} from "@angular/material/dialog";
import {ModalCreateProgramComponent} from "../modal-create-program/modal-create-program.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ReactiveFormsModule, CdkScrollable, MatFormFieldModule, MatSortModule, MatTableModule, MatPaginatorModule, MatSelectModule, MatOptionModule, NgFor, MatIconModule, MatInputModule, MatSlideToggleModule, NgIf, NgClass, NgTemplateOutlet, MatTooltipModule, MatProgressBarModule, MatButtonModule, RouterLink, PercentPipe, I18nPluralPipe, AsyncPipe, MatSortModule],
})
export class ListComponent implements AfterViewInit {

    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) _sort: MatSort;
    readonly dialog = inject(MatDialog);


    institutionId: string;

    programs$: Observable<Program[]>;

    searchInputControl: UntypedFormControl = new UntypedFormControl();

    displayColumns: string[] = ['_id', 'title', 'description', 'status', 'details'];

    pagination: Pagination;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    suggestionDetailsState: { [key: string]: boolean } = {};
    showDetails: boolean = false;

    selectedProgram: Program | null = null;
    selectedProgramForm: UntypedFormGroup;
    institutions: Institution[];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _programsService: ProgramService,
        private _liveAnnouncer: LiveAnnouncer,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _institutionService: InstitutionService
    ) {}

    ngOnInit(): void {
        this.getDatas();
        this.selectedProgramForm = this._formBuilder.group({
            _id: [''],
            name: [''],
            targetInstitutionId: [''],
            //archived: [''],
        })
    }

    getDatas () {
        this.institutionId = localStorage.getItem('%institution%');
        this._institutionService.institutions$.subscribe(value => {
            this.institutions = value.filter(item => item._id !== this.institutionId);
        });
        // Get the pagination
        this._programsService.pagination$
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
                    this._programsService.getProgramsByInstitutionId(0, 10, 'creation_date', 'asc', query, this.institutionId),
                ),
            )
            .subscribe();
        this._programsService.getProgramsByInstitutionId(0, 10,'creation_date', 'asc', '', localStorage.getItem('%institution%')).subscribe(value => {
            this.programs$ = this._programsService.programs$;
        })

    }

    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {

            // Set the initial sort
            this._sort.sort({
                id          : 'company_name',
                start       : 'asc',
                disableClear: true
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

                    return this._programsService.getProgramsByInstitutionId(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction, '', this.institutionId);
                }),
                map(() =>
                {
                    this.showFlashMessage('success');
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    createSelectedSuggestion(): void {
        /*this._programsService.createProgram().subscribe((newSuggestion) =>
        {
            this.selectedProgram = newSuggestion;

            this.selectedProgramForm.patchValue(newSuggestion);

            this._changeDetectorRef.markForCheck();
        });*/
    }

    updateSelectedProgram(): void {
        const pogram = this.selectedProgramForm.getRawValue();

        this._programsService.updateProgram(pogram._id, pogram).subscribe(() =>
        {
            this.getDatas();
            // Show success message
            this.showFlashMessage('success');
        });
    }

    deleteSelectedProgram(): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Archived program',
            message: 'Are you sure you want to archived this program? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Archived',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) =>
        {
            if ( result === 'confirmed' )
            {
                const program = this.selectedProgramForm.getRawValue();

                this._programsService.archivedProgram(program._id).subscribe(() =>
                {
                    this.closeDetails();
                })
            }
        });
    }

    updateStatus(newStatus: boolean): void {
        this.selectedProgramForm.patchValue({ status: newStatus });
        this.selectedProgram.archived = newStatus;
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ModalCreateProgramComponent, {

        });

        dialogRef.afterClosed().subscribe(result => {
            this.getDatas()
        });
    }

    showFlashMessage(type: 'success' | 'error'): void {
        this.flashMessage = type;

        this._changeDetectorRef.markForCheck();

        setTimeout(() => {
            this.flashMessage = null;

            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`)
        } else {
            this._liveAnnouncer.announce('Sorting clear');
        }
    }

    /**
     * Toggle suggestion details
     *
     * @param programId
     */
    toggleDetails(programId: string): void {
        if (this.selectedProgram && this.selectedProgram._id === programId) {
            this.closeDetails();
            return;
        }
        this._programsService.getProgramDetails(programId)
            .subscribe((program) => {
                // Set the selected product
                this.selectedProgram = program;

                // Fill the form
                this.selectedProgramForm.patchValue(program);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDetails(): void {
        this.selectedProgram = null;
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

}
