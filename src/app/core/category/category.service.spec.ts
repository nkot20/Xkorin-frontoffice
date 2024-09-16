import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { environment } from '../../../environments/environment';
import { Category } from './category.types';

describe('CategoryService', () => {
    let service: CategoryService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CategoryService]
        });

        service = TestBed.inject(CategoryService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch categories by language and update categories$', () => {
        const mockCategories: Category[] = [
            { _id: '1', label: 'Category 1', type: 'Type 1' },
            { _id: '2', label: 'Category 2', type: 'Type 2' }
        ];

        service.getCategoriesByLanguage('en').subscribe(categories => {
            expect(categories).toEqual(mockCategories);
            service.categories$.subscribe(updatedCategories => {
                expect(updatedCategories).toEqual(mockCategories);
            });
        });

        const req = httpMock.expectOne(`${environment.api}/category/en`);
        expect(req.request.method).toBe('GET');
        req.flush(mockCategories);
    });

    it('should set and get a category', () => {
        const mockCategory: Category = { _id: '1', label: 'Category 1', type: 'Type 1' };

        service.category$.subscribe(category => {
            expect(category).toEqual(mockCategory);
        });

        service.category = mockCategory;
    });
});
