import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExamService } from './exam.service';
import { Exam } from './exam.types';
import { environment } from '../../../environments/environment';

describe('ExamService', () => {
    let service: ExamService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ExamService]
        });

        service = TestBed.inject(ExamService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set and get exam correctly', () => {
        const mockExam: Exam = {
            _id: '1',
            institutionId: { _id: 'inst1' } as any,
            personId: 'person1',
            aim: 'aim1',
            amount: 100,
            audited: true
        };

        service.exam$.subscribe(exam => {
            expect(exam).toEqual(mockExam);
        });

        service.exam = mockExam;
    });

    it('should create an exam via HTTP POST', () => {
        const newExam: Exam = {
            _id: '1',
            institutionId: { _id: 'inst1' } as any,
            personId: 'person1',
            aim: 'aim1',
            amount: 100,
            audited: true
        };

        service.createExam(newExam).subscribe((response) => {
            expect(response).toEqual(newExam);
        });

        const req = httpMock.expectOne(`${environment.api}/exam/create`);
        expect(req.request.method).toBe('POST');
        req.flush(newExam);
    });

    it('should get person exams and update _exams subject', () => {
        const personId = 'person1';
        const mockExams: any[] = [
            { _id: '1', aim: 'aim1' },
            { _id: '2', aim: 'aim2' }
        ];

        service.getPersonExam(personId).subscribe(exams => {
            expect(exams).toEqual(mockExams);
        });

        const req = httpMock.expectOne(`${environment.api}/exam/${personId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockExams);
    });

    it('should get exam details and update _examDetails subject', () => {
        const examId = '1';
        const mockExamDetails: any = { _id: examId, aim: 'aim1' };

        service.getExamById(examId).subscribe(details => {
            expect(details).toEqual(mockExamDetails);
        });

        const req = httpMock.expectOne(`${environment.api}/exam/details/${examId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockExamDetails);
    });

    it('should get all exams and update _examDetails subject', () => {
        const mockExamDetails: any = [
            { _id: '1', aim: 'aim1' },
            { _id: '2', aim: 'aim2' }
        ];

        service.getAllExams().subscribe(details => {
            expect(details).toEqual(mockExamDetails);
        });

        const req = httpMock.expectOne(`${environment.api}/exam/all/exams`);
        expect(req.request.method).toBe('GET');
        req.flush(mockExamDetails);
    });

    it('should get all exams by institution ID and update _examDetails subject', () => {
        const institutionId = 'inst1';
        const mockExamDetails: any = [
            { _id: '1', aim: 'aim1' },
            { _id: '2', aim: 'aim2' }
        ];

        service.getAllExamsByInstitutionId(institutionId).subscribe(details => {
            expect(details).toEqual(mockExamDetails);
        });

        const req = httpMock.expectOne(`${environment.api}/exam/all/${institutionId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockExamDetails);
    });

    it('should get indiceAvailable$', () => {
        expect(service.indiceAvailable$).toBeUndefined();
    });

    it('should set and get idExam correctly', () => {
        service.idExam = 'exam1';
        expect(service.idExam).toBe('exam1');
    });
});
