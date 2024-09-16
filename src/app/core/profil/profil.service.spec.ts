import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfilService } from './profil.service';
import { Profil } from './profil.types';
import { environment } from '../../../environments/environment';

describe('ProfilService', () => {
    let service: ProfilService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProfilService]
        });

        service = TestBed.inject(ProfilService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch profiles and update _profils subject', () => {
        const isoCode = 'en';
        const mockProfiles: Profil[] = [
            { _id: "1", label: 'John Doe' },
            { _id: "2", label: 'Jane Doe' }
        ];

        service.getProfils(isoCode).subscribe((profiles) => {
            expect(profiles.length).toBe(2);
            expect(profiles).toEqual(mockProfiles);
        });

        const req = httpMock.expectOne(`${environment.api}/profil/${isoCode}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockProfiles);
    });

    it('should return profiles from profils$ observable', (done) => {
        const isoCode = 'en';
        const mockProfiles: Profil[] = [
            { _id: "1", label: 'John Doe' },
            { _id: "2", label: 'Jane Doe' }
        ];

        service.getProfils(isoCode).subscribe(() => {
            service.profils$.subscribe((profiles) => {
                expect(profiles).toEqual(mockProfiles);
                done();
            });
        });

        const req = httpMock.expectOne(`${environment.api}/profil/${isoCode}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockProfiles);
    });
});
