import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CciEvolutionComponent } from './cci-evolution.component';

describe('CciEvolutionComponent', () => {
  let component: CciEvolutionComponent;
  let fixture: ComponentFixture<CciEvolutionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CciEvolutionComponent]
    });
    fixture = TestBed.createComponent(CciEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
