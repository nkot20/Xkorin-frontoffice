import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainImprintComponent } from './main-imprint.component';

describe('MainImprintComponent', () => {
  let component: MainImprintComponent;
  let fixture: ComponentFixture<MainImprintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainImprintComponent]
    });
    fixture = TestBed.createComponent(MainImprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
