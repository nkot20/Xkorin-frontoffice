import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnswerService } from './answer.service';
import { environment } from '../../../environments/environment';

describe('AnswerService', () => {
    let service: AnswerService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AnswerService]
        });

        service = TestBed.inject(AnswerService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should save an answer via HTTP POST', () => {
        const mockAnswer = {
            _id: '1',
            institutionId: { _id: 'inst1' } as any,
            personId: 'person1',
            aim: 'aim1',
            amount: 100,
            audited: true
        };

        service.saveAnswer(mockAnswer).subscribe(response => {
            expect(response).toEqual(mockAnswer);
        });

        const req = httpMock.expectOne(`${environment.api}/answer/create`);
        expect(req.request.method).toBe('POST');
        req.flush(mockAnswer);
    });
});
