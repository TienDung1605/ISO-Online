import { HttpResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { of } from 'rxjs';
import { ConvertService } from '../../service/convert.service';
import { ConvertFormService } from '../convert-form.service';
import { ConvertUpdateComponent } from '../convert-update.component';

import { TestBed } from '@angular/core/testing';

describe('ConvertUpdateComponent.createForm() createForm method', () => {
  let component: ConvertUpdateComponent;
  let convertService: ConvertService;
  let convertFormService: ConvertFormService;
  let accountService: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: ConvertService,
          useValue: {
            checkNameExists: jest.fn().mockReturnValue(of(false)),
            update: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: ConvertFormService,
          useValue: {
            createConvertFormGroup: jest.fn().mockReturnValue(
              new FormBuilder().group({
                id: [null],
                name: [''],
                type: [''],
                mark: [''],
              }),
            ),
            getConvert: jest.fn().mockReturnValue({}),
            resetForm: jest.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ convert: null }),
          },
        },
        {
          provide: AccountService,
          useValue: {
            identity: jest.fn().mockReturnValue(of({ login: 'testUser' })),
          },
        },
      ],
    });

    component = TestBed.inject(ConvertUpdateComponent);
    convertService = TestBed.inject(ConvertService);
    convertFormService = TestBed.inject(ConvertFormService);
    accountService = TestBed.inject(AccountService);
  });

  describe('createForm', () => {
    it('should initialize the form with default values', () => {
      // Test to ensure the form initializes with default values
      component.createForm();
      expect(component.editForm.value).toEqual({
        id: null,
        name: '',
        type: '',
        mark: '',
      });
    });

    it('should set validators for the name control', () => {
      // Test to ensure the name control has the required and async validators
      component.createForm();
      const nameControl = component.editForm.get('name');
      expect(nameControl?.validator).toBeTruthy();
      expect(nameControl?.asyncValidator).toBeTruthy();
    });

    it('should update the form when a convert is provided', () => {
      // Test to ensure the form updates with provided convert data
      const convert = { id: 1, name: 'Test Convert', type: 'Type1', mark: 'Mark1' };
      component.updateForm(convert);
      expect(component.editForm.value).toEqual(convert);
    });
  });

  describe('Happy Paths', () => {
    it('should save a new convert successfully', () => {
      // Test to ensure a new convert is saved successfully
      jest.spyOn(convertService, 'create').mockReturnValue(of(new HttpResponse({ body: {} })));
      component.createForm();
      component.editForm.patchValue({ name: 'New Convert', type: 'Type1' });
      component.save();
      expect(convertService.create).toHaveBeenCalled();
    });

    it('should update an existing convert successfully', () => {
      // Test to ensure an existing convert is updated successfully
      jest.spyOn(convertService, 'update').mockReturnValue(of(new HttpResponse({ body: {} })));
      component.createForm();
      component.editForm.patchValue({ id: 1, name: 'Updated Convert', type: 'Type1' });
      component.save();
      expect(convertService.update).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle form submission with invalid data', () => {
      // Test to ensure form submission with invalid data is handled
      component.createForm();
      component.editForm.patchValue({ name: '', type: '' });
      component.save();
      expect(component.isSaving).toBe(false);
    });

    it('should handle duplicate name validation', () => {
      // Test to ensure duplicate name validation is handled
      jest.spyOn(convertService, 'checkNameExists').mockReturnValue(of(true));
      component.createForm();
      const nameControl = component.editForm.get('name');
      nameControl?.setValue('Duplicate Name');
      nameControl?.updateValueAndValidity();
      expect(nameControl?.errors).toEqual({ duplicate: true });
    });
  });
});
