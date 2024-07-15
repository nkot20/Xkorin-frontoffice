import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreInfosComponent } from './more-infos.component';

describe('MoreInfosComponent', () => {
  let component: MoreInfosComponent;
  let fixture: ComponentFixture<MoreInfosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoreInfosComponent]
    });
    fixture = TestBed.createComponent(MoreInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
