import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ModalCreateProgramComponent } from './modal-create-program.component';
import { ToastrService } from 'ngx-toastr';
import { ProgramService } from '../../../../../core/program/program.service';
import { InstitutionService } from '../../../../../core/institution/institution.service';
import { UserService } from '../../../../../core/user/user.service';
import { Institution } from '../../../../../core/institution/institution.type';

describe('ModalCreateProgramComponent', () => {
    let component: ModalCreateProgramComponent;
    let fixture: ComponentFixture<ModalCreateProgramComponent>;
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<ModalCreateProgramComponent>>;
    let mockToastrService: jasmine.SpyObj<ToastrService>;
    let mockProgramService: jasmine.SpyObj<ProgramService>;
    let mockInstitutionService: jasmine.SpyObj<InstitutionService>;
    let mockUserService: jasmine.SpyObj<UserService>;

    beforeEach(async () => {
        mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        mockProgramService = jasmine.createSpyObj('ProgramService', ['createProgram']);
        mockInstitutionService = jasmine.createSpyObj('InstitutionService', [], { institutions$: of([]) });
        mockUserService = jasmine.createSpyObj('UserService', [], { user$: of({ institution: {} as Institution }) });

        await TestBed.configureTestingModule({
            declarations: [ModalCreateProgramComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: ToastrService, useValue: mockToastrService },
                { provide: ProgramService, useValue: mockProgramService },
                { provide: InstitutionService, useValue: mockInstitutionService },
                { provide: UserService, useValue: mockUserService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalCreateProgramComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form on ngOnInit', () => {
        expect(component.programForm).toBeDefined();
        expect(component.programForm.get('name')).toBeDefined();
        expect(component.programForm.get('targetInstitutionId')).toBeDefined();
    });

    it('should not submit the form if it is invalid', () => {
        component.onSubmit();
        expect(mockProgramService.createProgram).not.toHaveBeenCalled();
    });

    it('should submit the form if it is valid', () => {
        component.programForm.setValue({ name: 'Test Program', targetInstitutionId: 'institutionId123' });
        component.userValue = {
            email: "", id: "", name: "",
            institution: {
                _id: 'institution123',
                name: 'Test Institution',
                email: 'test@example.com',
                status: 'active',
                business_code: '12345',
                description: 'A test institution',
            } as Institution
        };
        component.onSubmit();
        expect(mockProgramService.createProgram).toHaveBeenCalledWith({
            name: 'Test Program',
            targetInstitutionId: 'institutionId123',
            institutionId: 'institution123'
        });
    });

/*    it('should close the dialog on successful form submission', () => {
        component.programForm.setValue({ name: 'Test Program', targetInstitutionId: 'institutionId123' });
        component.userValue = {
            institution: {
                _id: 'institution123',
                name: 'Test Institution',
                email: 'test@example.com',
                status: 'active',
                business_code: '12345',
                description: 'A test institution',
            } as Institution
        };
        mockProgramService.createProgram.and.returnValue(of({}));
        component.onSubmit();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });*/
});
