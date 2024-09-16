import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImprintInstitutionService } from './imprint-institution.service';
import { environment } from '../../../environments/environment';
import { ImprintInstitution } from './imprint-institution.types';

describe('ImprintInstitutionService', () => {
    let service: ImprintInstitutionService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ImprintInstitutionService]
        });

        service = TestBed.inject(ImprintInstitutionService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should save imprint institution and return response', () => {
        const payload = { institutionId: '123', status: 'active', isAddedForAnInstitution: 'yes' };
        const mockResponse = { success: true };

        service.save(payload).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.api}/imprint-institution/create`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);
        req.flush(mockResponse);
    });

    it('should get imprints by institution ID and return response', () => {
        const institutionId = '123';
        const mockResponse: ImprintInstitution[] = [
            { _id: '1', institutionId: '123', status: 'active', isAddedForAnInstitution: 'yes' },
            { _id: '2', institutionId: '123', status: 'inactive', isAddedForAnInstitution: 'no' }
        ];

        service.getImprintsByInstitution(institutionId).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.api}/imprint-institution/imprint-institution/${institutionId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
});
