import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { of, Subject } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {By, DomSanitizer} from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import {ListComponent} from "./list.component";
import {ProgramService} from "../../../../../core/program/program.service";
import {InstitutionService} from "../../../../../core/institution/institution.service";
import {FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";
import {Program} from "../../../../../core/program/program.types";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;

    const mockProgramService = {
        getProgramsByInstitutionId: jasmine.createSpy('getProgramsByInstitutionId').and.returnValue(of([])),
        programs$: of([]),
        pagination$: of({}),
        updateProgram: jasmine.createSpy('updateProgram').and.returnValue(of({})),
        archivedProgram: jasmine.createSpy('archivedProgram').and.returnValue(of({}))
    };

    const mockInstitutionService = {
        institutions$: of([])
    };

    const mockFuseConfirmationService = {
        open: jasmine.createSpy('open').and.returnValue({
            afterClosed: of('confirmed')
        })
    };

    const mockLiveAnnouncer = {
        announce: jasmine.createSpy('announce')
    };

    const mockMatDialog = {
        open: jasmine.createSpy('open').and.returnValue({
            afterClosed: of({})
        })
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ListComponent,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatIconModule,
                MatSelectModule,
                MatButtonModule,
                MatProgressBarModule,
                MatPaginatorModule,
                HttpClientTestingModule,
                NoopAnimationsModule
            ],
            providers: [
                {
                    provide: ActivatedRoute, // Simulate the ActivatedRoute
                    useValue: {
                        snapshot: { paramMap: { get: () => '123' } }, // Simulate parameters
                        queryParams: of({}), // Simulate query params
                        paramMap: of({ get: (key: string) => 'some value' }) // Simulate param map
                    }
                },
                {
                    provide: MatIconRegistry,
                    useValue: {
                        addSvgIcon: () => {},
                        getNamedSvgIcon: () => of(document.createElementNS('http://www.w3.org/2000/svg', 'svg')),
                        // autres méthodes mockées si nécessaire
                    }
                },
                {
                    provide: DomSanitizer
                    ,
                    useValue: {
                        bypassSecurityTrustResourceUrl: (url: string) => url,
                    }
                },
                { provide: ProgramService, useValue: mockProgramService },
                { provide: InstitutionService, useValue: mockInstitutionService },
                { provide: FuseConfirmationService, useValue: mockFuseConfirmationService },
                { provide: LiveAnnouncer, useValue: mockLiveAnnouncer },
                { provide: MatDialog, useValue: mockMatDialog },
                UntypedFormBuilder
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display loading indicator when isLoading is true', () => {
        component.isLoading = true;
        fixture.detectChanges();
        const progressBar = fixture.debugElement.query(By.css('mat-progress-bar'));
        expect(progressBar).toBeTruthy();
    });

    it('should display program title', () => {
        const titleElement = fixture.debugElement.query(By.css('.text-4xl'));
        expect(titleElement.nativeElement.textContent).toContain('Programs');
    });

    it('should trigger openDialog method on Add button click', () => {
        spyOn(component, 'openDialog');
        const addButton = fixture.debugElement.query(By.css('button[mat-flat-button]'));
        addButton.triggerEventHandler('click', null);
        expect(component.openDialog).toHaveBeenCalled();
    });

    it('should show no suggestions message if programs$ is empty', () => {
        component.programs$ = of([]);
        fixture.detectChanges();
        const noSuggestionsElement = fixture.debugElement.query(By.css('ng-template#noSuggestions'));
        expect(noSuggestionsElement).toBeTruthy();
    });

    it('should show program details when toggled', () => {
        const program: Program = { _id: '1', name: 'Test Program', targetName: 'Test Target', archived: false };
        component.programs$ = of([program]);
        component.toggleDetails(program._id); // Manually trigger toggle
        fixture.detectChanges(); // Ensure the view is updated
        const detailsElement = fixture.debugElement.query(By.css('ng-template#detailsTemplate'));
        expect(detailsElement).toBeTruthy();
    });


    it('should call toggleDetails when details button is clicked', () => {
        const program: Program = { _id: '1', name: 'Test Program', targetName: 'Test Target', archived: false };
        spyOn(component, 'toggleDetails');
        component.programs$ = of([program]);
        fixture.detectChanges();
        const detailsButton = fixture.debugElement.query(By.css('button[mat-stroked-button]'));
        detailsButton.triggerEventHandler('click', null);
        expect(component.toggleDetails).toHaveBeenCalledWith(program._id);
    });

    it('should update program on form submit', () => {
        const program: Program = { _id: '1', name: 'Updated Program', targetInstitutionId: '123' };
        component.selectedProgram = program;
        component.selectedProgramForm.setValue({ _id: program._id, name: program.name, targetInstitutionId: program.targetInstitutionId });
        fixture.detectChanges(); // Ensure the form and DOM are updated

        const updateButton = fixture.debugElement.query(By.css('button[type="submit"]'));
        expect(updateButton).toBeTruthy(); // Ensure the button exists
        updateButton.triggerEventHandler('click', null);
        expect(component.updateSelectedProgram).toHaveBeenCalled();
    });


    it('should delete program when Archived button is clicked', () => {
        spyOn(component, 'archivedSelectedProgram');
        const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
        deleteButton.triggerEventHandler('click', null);
        expect(component.archivedSelectedProgram).toHaveBeenCalled();
    });
});
