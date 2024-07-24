import { TestBed } from '@angular/core/testing';

import { ImprintInstitutionService } from './imprint-institution.service';

describe('ImprintInstitutionService', () => {
  let service: ImprintInstitutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImprintInstitutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
