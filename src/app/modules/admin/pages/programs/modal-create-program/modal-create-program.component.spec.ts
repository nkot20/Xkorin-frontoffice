import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateProgramComponent } from './modal-create-program.component';

describe('ModalCreateProgramComponent', () => {
  let component: ModalCreateProgramComponent;
  let fixture: ComponentFixture<ModalCreateProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCreateProgramComponent]
    });
    fixture = TestBed.createComponent(ModalCreateProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
