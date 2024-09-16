import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeightService } from './weight.service';
import { environment } from '../../../environments/environment';

describe('WeightService', () => {
    let service: WeightService;
    let httpMock: HttpTestingController;

    const mockPayload = {
        optionId: '1',
        institutionId: 'inst1',
        variableId: 'var1'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [WeightService]
        });

        service = TestBed.inject(WeightService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should save weight and send POST request', () => {
        service.save(mockPayload).subscribe(response => {
            expect(response).toBeTruthy(); // Vous pouvez affiner cette assertion en fonction de la réponse attendue
        });

        const req = httpMock.expectOne(`${environment.api}/weight/create`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockPayload);
        req.flush({}); // Simulez une réponse vide ou ajustez selon votre API
    });
});
