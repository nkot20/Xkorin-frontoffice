import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailExamComponent } from './detail-exam.component';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RouterTestingModule } from '@angular/router/testing';
import { ImprintService } from '../../../../../core/imprint/imprint.service';
import { ExamService } from '../../../../../core/exam/exam.service';
import { UserService } from '../../../../../core/user/user.service';
import { ApexChart, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { By } from '@angular/platform-browser';

describe('DetailExamComponent', () => {
    let component: DetailExamComponent;
    let fixture: ComponentFixture<DetailExamComponent>;
    let imprintService: jasmine.SpyObj<ImprintService>;
    let examService: jasmine.SpyObj<ExamService>;
    let userService: jasmine.SpyObj<UserService>;

    beforeEach(async () => {
        const imprintServiceSpy = jasmine.createSpyObj('ImprintService', ['getImprintsByExam', 'getImprintsValues', 'getStatistics']);
        const examServiceSpy = jasmine.createSpyObj('ExamService', ['getExamById']);
        const userServiceSpy = jasmine.createSpyObj('UserService', ['userValue']);

        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                MatTabsModule,
                NgApexchartsModule,
                RouterTestingModule,
                DetailExamComponent
            ],
            providers: [
                { provide: ImprintService, useValue: imprintServiceSpy },
                { provide: ExamService, useValue: examServiceSpy },
                { provide: UserService, useValue: userServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DetailExamComponent);
        component = fixture.componentInstance;
        imprintService = TestBed.inject(ImprintService) as jasmine.SpyObj<ImprintService>;
        examService = TestBed.inject(ExamService) as jasmine.SpyObj<ExamService>;
        userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set companyName and urlCertificat on init', () => {
        userService.userValue = {email: "", id: "", name: "", company: {_id: '1', name: 'Test Company', status: '' } };
        examService.idExam = '123';
        component.ngOnInit();
        expect(component.companyName).toBe('Test Company');
        expect(component.urlCertificat).toBe('http://example.com/certificats/imprints-fusion/123.pdf');
    });

    it('should call getExamById and set examDetails', () => {
        const examDetails = { exam: { aim: 'Test Aim', amount: 1000, createdAt: new Date(), audited: true }, institution: { name: 'Test Institution' } };
        examService.getExamById.and.returnValue(of(examDetails));
        component.ngOnInit();
        expect(examService.getExamById).toHaveBeenCalledWith('123');
        fixture.detectChanges();
        const aimElement = fixture.debugElement.query(By.css('td:nth-child(2)')).nativeElement;
        expect(aimElement.textContent).toContain('Test Aim');
    });

    it('should handle error in getExamById', () => {
        examService.getExamById.and.returnValue(throwError(() => new Error('Error')));
        component.ngOnInit();
        fixture.detectChanges();
        // You can test the behavior when there's an error, such as showing an error message
    });

    it('should render chart correctly', () => {
        const chartOptions = {
            series: [{ name: 'Min', data: [1, 2, 3] }],
            chart: { type: 'line', height: 350 },
            xaxis: { categories: ['Jan', 'Feb', 'Mar'] },
            yaxis: { min: 0 }
        };
        //component.chartOptions = chartOptions;
        fixture.detectChanges();
        const chartElement = fixture.debugElement.query(By.css('apx-chart'));
        expect(chartElement).toBeTruthy();
    });

});
