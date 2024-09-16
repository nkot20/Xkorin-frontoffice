import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImprintService } from './imprint.service';
import { StateService } from '../state/state.service';
import { CompanyService } from '../company/company.service';
import { environment } from '../../../environments/environment';

describe('ImprintService', () => {
    let service: ImprintService;
    let httpMock: HttpTestingController;
    let stateService: StateService;
    let companyService: CompanyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ImprintService, StateService, CompanyService]
        });

        service = TestBed.inject(ImprintService);
        httpMock = TestBed.inject(HttpTestingController);
        stateService = TestBed.inject(StateService);
        companyService = TestBed.inject(CompanyService);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch imprints with variables and update _imprints', () => {
        const mockResponse = [{ id: '1', name: 'Imprint 1' }];
        const profilId = '123';
        const subcategoryId = '456';
        const isoCode = 'en';

        service.getImprintsWithVariables(profilId, subcategoryId, isoCode).subscribe(response => {
            expect(response).toEqual(mockResponse);
            service.imprints$.subscribe(imprints => {
                expect(imprints).toEqual(mockResponse);
            });
        });

        const req = httpMock.expectOne(`${environment.api}/imprint/variable-questions/${profilId}/${subcategoryId}/${isoCode}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch imprints by exam ID and sort them', () => {
        const mockResponse = [
            { imprint: { number: 2 } },
            { imprint: { number: 1 } }
        ];
        const examId = 'exam123';

        service.getImprintsByExam(examId).subscribe(response => {
            expect(response).toEqual([
                { imprint: { number: 1 } },
                { imprint: { number: 2 } }
            ]);
            service.imprints$.subscribe(imprints => {
                expect(imprints).toEqual([
                    { imprint: { number: 1 } },
                    { imprint: { number: 2 } }
                ]);
            });
        });

        const req = httpMock.expectOne(`${environment.api}/imprint/dashboard/${examId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch remaining variables for imprints and update _imprints', () => {
        const mockResponse = [{ id: '2', name: 'Imprint 2' }];
        const profilId = '123';
        const subcategoryId = '456';
        const isoCode = 'en';
        const examId = 'exam123';

        service.getRemainingVariablesForImprints(profilId, subcategoryId, isoCode, examId).subscribe(response => {
            expect(response).toEqual(mockResponse);
            service.imprints$.subscribe(imprints => {
                expect(imprints).toEqual(mockResponse);
            });
        });

        const req = httpMock.expectOne(`${environment.api}/imprint/remaining-variables/${profilId}/${subcategoryId}/${isoCode}/${examId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch exam index and update _indexScore', () => {
        const mockResponse = { score: 85 };
        const examId = 'exam123';

        service.getExamIndex(examId).subscribe(() => {
            service.indexScore$.subscribe(score => {
                expect(score).toEqual(mockResponse.score);
            });
        });

        const req = httpMock.expectOne(`${environment.api}/imprint/cii/${examId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch imprint statistics and update _imprintStatistics', () => {
        const mockResponse = [{ stat: 'value' }];

        service.getStatistics().subscribe(() => {
            service.imprintStatistics$.subscribe(stats => {
                expect(stats).toEqual(mockResponse);
            });
        });

        const req = httpMock.expectOne(`${environment.api}/imprint/statistics`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch imprint values and update _imprintsValues', () => {
        const mockResponse = [{ value: 'value' }];
        const examId = 'exam123';

        service.getImprintsValues(examId).subscribe(() => {
            service.imprintsValues$.subscribe(values => {
                expect(values).toEqual(mockResponse);
            });
        });

        const req = httpMock.expectOne(`${environment.api}/imprint/imprints-values/${examId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch imprint values details and update all relevant subjects', () => {
        const mockResponse = {
            imprintValue: [{ value: 'value' }],
            variableTree: [{ tree: 'data' }],
            evolution: [{ evolution: 'data' }],
            examDetails: { exam: 'details' },
            company: [{ company: 'data' }]
        };
        const institutionId = 'inst123';
        const personId = 'person123';

        service.getImprintsValuesDetailsCompanies(institutionId, personId).subscribe(() => {
            service.imprintsValues$.subscribe(values => {
                expect(values).toEqual(mockResponse.imprintValue);
            });
            service.imprints$.subscribe(imprints => {
                expect(imprints).toEqual(mockResponse.variableTree);
            });
            service.infosImprintDetailsCompany$.subscribe(info => {
                expect(info).toEqual(mockResponse.evolution);
            });
            service.examDetails$.subscribe(details => {
                expect(details).toEqual(mockResponse.examDetails);
            });
            companyService.companies.subscribe(companies => {
                expect(companies).toEqual(mockResponse.company);
            });
        });

        const req = httpMock.expectOne(`${environment.api}/imprint/${institutionId}/evolution/${personId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch imprint values evolution of a person and update all relevant subjects', () => {
        const mockResponse = {
            imprintValue: [{ value: 'value' }],
            variableTree: [{ tree: 'data' }],
            evolution: [{ evolution: 'data' }],
            examDetails: { exam: 'details' }
        };
        const personId = 'person123';

        service.getImprintsValuesEvolutionOfPerson(personId).subscribe(() => {
            service.imprintsValues$.subscribe(values => {
                expect(values).toEqual(mockResponse.imprintValue);
            });
            service.imprints$.subscribe(imprints => {
                expect(imprints).toEqual(mockResponse.variableTree);
            });
            service.infosImprintDetailsCompany$.subscribe(info => {
                expect(info).toEqual(mockResponse.evolution);
            });
            service.examDetails$.subscribe(details => {
                expect(details).toEqual(mockResponse.examDetails);
            });
        });

        const req = httpMock.expectOne(`${environment.api}/imprint/evolution/${personId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
});
