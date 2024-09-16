import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProgramService } from './program.service';
import { environment } from '../../../environments/environment';
import { Program } from './program.types';

describe('ProgramService', () => {
    let service: ProgramService;
    let httpMock: HttpTestingController;

    const mockPrograms = {
        programs: [
            { _id: '1', name: 'Program 1', institutionId: 'inst1', archived: false },
            { _id: '2', name: 'Program 2', institutionId: 'inst2', archived: true }
        ],
        pagination: {
            currentPage: 1,
            totalPages: 5
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProgramService]
        });

        service = TestBed.inject(ProgramService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get programs by institution ID with pagination and update ReplaySubject and BehaviorSubject', () => {
        const institutionId = 'inst1';
        const page = 0;
        const size = 10;
        const sort = 'creation_date';
        const order: 'asc' | 'desc' = 'asc';
        const search = '';

        service.programs$.subscribe(programs => {
            expect(programs).toEqual(mockPrograms.programs);
        });

        service.pagination$.subscribe(pagination => {
            expect(pagination).toEqual(mockPrograms.pagination);
        });

        const req = httpMock.expectOne(`${environment.api}/program/${institutionId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockPrograms);
    });

    it('should get programs by institution ID without pagination and update ReplaySubject', () => {
        const institutionId = 'inst1';

        service.programs$.subscribe(programs => {
            expect(programs).toEqual(mockPrograms.programs);
        });

        const req = httpMock.expectOne(`${environment.api}/program/${institutionId}/no-pagination`);
        expect(req.request.method).toBe('GET');
        req.flush(mockPrograms.programs);
    });

    it('should get all programs and update ReplaySubject', () => {
        service.programs$.subscribe(programs => {
            expect(programs).toEqual(mockPrograms.programs);
        });

        const req = httpMock.expectOne(`${environment.api}/program`);
        expect(req.request.method).toBe('GET');
        req.flush(mockPrograms.programs);
    });

    it('should create a program', () => {
        const payload = { name: 'New Program' };
        const newProgram: Program = { _id: '3', ...payload };

        service.createProgram(payload).subscribe(program => {
            expect(program).toEqual(newProgram);
        });

        const req = httpMock.expectOne(`${environment.api}/program/create`);
        expect(req.request.method).toBe('POST');
        req.flush(newProgram);
    });

    it('should update a program', () => {
        const id = '1';
        const payload = { name: 'Updated Program' };
        const updatedProgram: Program = { _id: id, ...payload };

        service.updateProgram(id, payload).subscribe(program => {
            expect(program).toEqual(updatedProgram);
        });

        const req = httpMock.expectOne(`${environment.api}/program/update/${id}`);
        expect(req.request.method).toBe('PATCH');
        req.flush(updatedProgram);
    });

    it('should archive a program', () => {
        const id = '1';

        service.archivedProgram(id).subscribe(response => {
            expect(response).toBeNull();
        });

        const req = httpMock.expectOne(`${environment.api}/program/archived/${id}`);
        expect(req.request.method).toBe('PATCH');
        req.flush(null);
    });

    it('should get program details', () => {
        const id = '1';
        const programDetails: Program = { _id: id, name: 'Program Details', institutionId: 'inst1' };

        service.getProgramDetails(id).subscribe(program => {
            expect(program).toEqual(programDetails);
        });

        const req = httpMock.expectOne(`${environment.api}/program/details/${id}`);
        expect(req.request.method).toBe('GET');
        req.flush(programDetails);
    });
});
