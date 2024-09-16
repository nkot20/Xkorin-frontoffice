import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubCategoryService } from './sub-category.service';
import { environment } from '../../../environments/environment';
import { SubCategory } from './sub-category.types';

describe('SubCategoryService', () => {
    let service: SubCategoryService;
    let httpMock: HttpTestingController;

    const mockSubCategories: SubCategory[] = [
        { _id: '1', label: 'SubCategory 1', categoryId: 'cat1' },
        { _id: '2', label: 'SubCategory 2', categoryId: 'cat1' }
    ];

    const mockSubCategory: SubCategory = { _id: '1', label: 'SubCategory 1', categoryId: 'cat1' };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SubCategoryService]
        });

        service = TestBed.inject(SubCategoryService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifiez que toutes les requêtes HTTP ont été traitées
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get sub-categories by category and language and update ReplaySubject', () => {
        const idCategory = 'cat1';
        const isoCode = 'en';

        service.subCategories$.subscribe(subCategories => {
            expect(subCategories).toEqual(mockSubCategories);
        });

        const req = httpMock.expectOne(`${environment.api}/sub-category/${idCategory}/${isoCode}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockSubCategories);
    });

    it('should set and get a sub-category', () => {
        service.subCategory$.subscribe(subCategory => {
            expect(subCategory).toEqual(mockSubCategory);
        });

        service.subCategory = mockSubCategory;
    });
});
