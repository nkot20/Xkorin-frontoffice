import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OptionService } from './option.service';
import { environment } from '../../../environments/environment';
import { Option } from './option.types';

describe('OptionService', () => {
    let service: OptionService;
    let httpMock: HttpTestingController;

    const mockOptions = {
        optionsImportant: [
            { _id: '1', label: 'Important Option 1', value: 10 },
            { _id: '2', label: 'Important Option 2', value: 20 }
        ],
        optionsNotImportant: [
            { _id: '3', label: 'Not Important Option 1', value: 5 },
            { _id: '4', label: 'Not Important Option 2', value: 15 }
        ]
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [OptionService]
        });

        service = TestBed.inject(OptionService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get options and update the ReplaySubjects', () => {
        service.optionsImportant$.subscribe(options => {
            expect(options).toEqual(mockOptions.optionsImportant);
        });

        service.optionsNotImportant$.subscribe(options => {
            expect(options).toEqual(mockOptions.optionsNotImportant);
        });

        const isoCode = 'en';
        const req = httpMock.expectOne(`${environment.api}/option/${isoCode}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockOptions);
    });
});
