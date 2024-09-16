import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InstitutionService } from './institution.service';
import { environment } from '../../../environments/environment';
import { Institution } from './institution.type';

describe('InstitutionService', () => {
    let service: InstitutionService;
    let httpMock: HttpTestingController;

    const mockInstitutions: Institution[] = [
        {
            _id: '1',
            name: 'Institution A',
            email: 'contact@institutiona.com',
            status: 'active',
            business_code: 'A123',
            description: 'Description A',
            customization: {
                logo: 'logoA.png',
                signature: 'signatureA.png'
            }
        },
        {
            _id: '2',
            name: 'Institution B',
            email: 'contact@institutionb.com',
            status: 'inactive',
            business_code: 'B123',
            description: 'Description B',
            customization: {
                logo: 'logoB.png',
                signature: 'signatureB.png'
            }
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [InstitutionService]
        });

        service = TestBed.inject(InstitutionService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get institutions and update the ReplaySubject', () => {
        service.institutions$.subscribe(institutions => {
            expect(institutions).toEqual(mockInstitutions);
        });

        const req = httpMock.expectOne(`${environment.api}/institution`);
        expect(req.request.method).toBe('GET');
        req.flush(mockInstitutions);
    });

    it('should get institutions by type and update the ReplaySubject', () => {
        const type = 'typeA';
        service.institutions$.subscribe(institutions => {
            expect(institutions).toEqual(mockInstitutions);
        });

        const req = httpMock.expectOne(`${environment.api}/institution/type/${type}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockInstitutions);
    });

    it('should update institution after first inscription', () => {
        const userId = 'user123';
        const institutionId = 'inst123';
        const updateData = { name: 'Updated Institution' };
        const mockResponse = { ...mockInstitutions[0], ...updateData };

        service.updateInstitutionAfterFirstInscription(userId, institutionId, updateData).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.api}/institution/update-first-login/${institutionId}/user/${userId}`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(updateData);
        req.flush(mockResponse);
    });
});
