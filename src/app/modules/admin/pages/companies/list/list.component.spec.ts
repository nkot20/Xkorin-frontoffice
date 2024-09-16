import { ComponentFixture, TestBed } from '@angular/core/testing';
import {By, DomSanitizer} from '@angular/platform-browser';
import { ListComponent } from './list.component';
import { CompanyService } from '../../../../../core/company/company.service';
import { UserService } from '../../../../../core/user/user.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {ActivatedRoute} from "@angular/router";

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;
    let companyService: jasmine.SpyObj<CompanyService>;
    let userService: jasmine.SpyObj<UserService>;

    beforeEach(async () => {
        const companyServiceSpy = jasmine.createSpyObj('CompanyService', ['getCompanies', 'pagination']);
        const userServiceSpy = jasmine.createSpyObj('UserService', ['']);

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                HttpClientTestingModule,
                MatProgressBarModule,
                MatInputModule,
                MatIconModule,
                MatButtonModule,
                MatTableModule,
                MatSortModule,
                MatPaginatorModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                ListComponent
            ],
            providers: [
                { provide: CompanyService, useValue: companyServiceSpy },
                { provide: UserService, useValue: userServiceSpy },
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
            ]
        }).compileComponents();

        companyService = TestBed.inject(CompanyService) as jasmine.SpyObj<CompanyService>;
        userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display a loading indicator when isLoading is true', () => {
        component.isLoading = true;
        fixture.detectChanges();
        const progressBar = fixture.debugElement.query(By.css('mat-progress-bar'));
        expect(progressBar).toBeTruthy();
    });

    it('should display a message when no companies are found', () => {
        companyService.getCompanies.and.returnValue(of([]));
        component.ngOnInit();
        fixture.detectChanges();
        const noCompaniesMessage = fixture.debugElement.query(By.css('.text-2xl'));
        expect(noCompaniesMessage.nativeElement.textContent).toContain('No companies found!');
    });

    it('should call getCompanies on search input change', () => {
        const searchTerm = 'test';
        companyService.getCompanies.and.returnValue(of([]));
        component.searchInputControl.setValue(searchTerm);
        fixture.detectChanges();
        expect(companyService.getCompanies).toHaveBeenCalledWith(0, 10, 'creation_date', 'asc', searchTerm, component.institutionId);
    });

    it('should call getCompanies with proper parameters on sort or page change', () => {
        companyService.getCompanies.and.returnValue(of([]));
        component._sort.active = 'name';
        component._sort.direction = 'asc';
        component._paginator.pageIndex = 1;
        component._paginator.pageSize = 10;
        component.ngAfterViewInit();
        fixture.detectChanges();
        expect(companyService.getCompanies).toHaveBeenCalledWith(1, 10, 'name', 'asc', '', component.institutionId);
    });

    it('should show success flash message on successful data load', () => {
        companyService.getCompanies.and.returnValue(of([]));
        component.ngAfterViewInit();
        fixture.detectChanges();
        component.showFlashMessage('success');
        fixture.detectChanges();
        const flashMessage = fixture.debugElement.query(By.css('.text-2xl'));
        expect(flashMessage.nativeElement.textContent).toContain('success');
    });
});
