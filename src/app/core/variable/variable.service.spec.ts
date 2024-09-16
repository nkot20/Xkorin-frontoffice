import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VariableService } from './variable.service';
import { environment } from '../../../environments/environment';

describe('VariableService', () => {
    let service: VariableService;
    let httpMock: HttpTestingController;

    const mockVariables = [
        { _id: '1', weight: 10 },
        { _id: '2', weight: 20 }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [VariableService]
        });

        service = TestBed.inject(VariableService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get variables and update ReplaySubject', () => {
        const institutionId = 'inst1';
        const isoCode = 'en';

        service.variables$.subscribe(variables => {
            expect(variables).toEqual(mockVariables);
        });

        const req = httpMock.expectOne(`${environment.api}/variable/weight/${institutionId}/${isoCode}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockVariables);
    });
});
