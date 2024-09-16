import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompanyService } from './company.service';
import { environment } from '../../../environments/environment';
import { Company } from './company.types';

describe('CompanyService', () => {
    let service: CompanyService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CompanyService]
        });

        service = TestBed.inject(CompanyService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch companies and update _companies and _pagination', () => {
        const mockResponse = {
            companies: [
                { _id: '1', name: 'Company 1', status: 'active' },
                { _id: '2', name: 'Company 2', status: 'inactive' }
            ],
            pagination: { page: 1, size: 10, total: 2 }
        };

        service.getCompanies(0, 10, 'creation_date', 'asc', '', 'institutionId').subscribe(response => {
            expect(response).toEqual(mockResponse.companies);
            service.companies.subscribe(companies => {
                expect(companies).toEqual(mockResponse.companies);
            });
            service.pagination.subscribe(pagination => {
                expect(pagination).toEqual(mockResponse.pagination);
            });
        });

        const req = httpMock.expectOne(`${environment.api}/company/institutionId/all`);
        expect(req.request.method).toBe('GET');
        expect(req.request.params.get('page')).toBe('0');
        expect(req.request.params.get('limit')).toBe('10');
        expect(req.request.params.get('sort')).toBe('creation_date');
        expect(req.request.params.get('order')).toBe('asc');
        expect(req.request.params.get('search')).toBe('');
        req.flush(mockResponse);
    });
});
