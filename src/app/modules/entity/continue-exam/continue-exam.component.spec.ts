import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueExamComponent } from './continue-exam.component';

describe('ContinueExamComponent', () => {
  let component: ContinueExamComponent;
  let fixture: ComponentFixture<ContinueExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContinueExamComponent]
    });
    fixture = TestBed.createComponent(ContinueExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
