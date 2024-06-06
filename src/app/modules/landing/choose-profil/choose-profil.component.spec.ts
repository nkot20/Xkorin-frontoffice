import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseProfilComponent } from './choose-profil.component';

describe('ChooseProfilComponent', () => {
  let component: ChooseProfilComponent;
  let fixture: ComponentFixture<ChooseProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseProfilComponent]
    });
    fixture = TestBed.createComponent(ChooseProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
