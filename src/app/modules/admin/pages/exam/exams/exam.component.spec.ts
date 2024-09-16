import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamsComponent } from './exams.component';
import { ExamService } from '../../../../../core/exam/exam.service';
import { UserService } from '../../../../../core/user/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectorRef } from '@angular/core';

describe('ExamsComponent', () => {
    let component: ExamsComponent;
    let fixture: ComponentFixture<ExamsComponent>;
    let examService: jasmine.SpyObj<ExamService>;
    let userService: jasmine.SpyObj<UserService>;
    let router: jasmine.SpyObj<Router>;
    let changeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

    beforeEach(async () => {
        const examServiceMock = jasmine.createSpyObj('ExamService', ['getPersonExam']);
        const userServiceMock = jasmine.createSpyObj('UserService', ['userValue']);
        const routerMock = jasmine.createSpyObj('Router', ['navigate']);
        const changeDetectorRefMock = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);

        examServiceMock.getPersonExam.and.returnValue(of([]));  // Mock observable
        userServiceMock.userValue = { person: { _id: 'mockPersonId' } };

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, MatIconModule, ExamsComponent],
            providers: [
                { provide: ExamService, useValue: examServiceMock },
                { provide: UserService, useValue: userServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ChangeDetectorRef, useValue: changeDetectorRefMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ExamsComponent);
        component = fixture.componentInstance;
        examService = TestBed.inject(ExamService) as jasmine.SpyObj<ExamService>;
        userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        changeDetectorRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize data on ngOnInit', () => {
        const mockExams = [
            { exam: { aim: 'Financing', audited: true, createdAt: '2024-01-01', indiceAvailable: true } },
            { exam: { aim: 'Support', audited: false, createdAt: '2024-02-01', indiceAvailable: false } }
        ];
        examService.getPersonExam.and.returnValue(of(mockExams));

        component.ngOnInit();

        expect(component.exams).toEqual(mockExams);
        expect(component.examsFinancing.length).toBe(1);
        expect(component.examsSupport.length).toBe(1);
        expect(component.examsAudited.length).toBe(1);
        expect(component.examsNotCompleted.length).toBe(1);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle errors on ngOnInit', () => {
        examService.getPersonExam.and.returnValue(throwError('Error'));

        component.ngOnInit();

        expect(component.isLoading).toBeFalse();
    });

    it('should navigate to new exam page on onGoToNewExam', () => {
        component.onGoToNewExam();
        expect(router.navigate).toHaveBeenCalledWith(['/assessment/new']);
    });

    it('should format date as relative', () => {
        const date = '2024-01-01T00:00:00Z';
        const relativeDate = component.formatDateAsRelative(date);
        expect(relativeDate).toBe('1 month ago');  // Adjust based on current date
    });

    it('should track by function', () => {
        const item = { id: 1 };
        expect(component.trackByFn(0, item)).toBe(1);
        expect(component.trackByFn(0, {})).toBe(0);
    });
});
