import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../fields.test-samples';

import { FieldsFormService } from './fields-form.service';

describe('Fields Form Service', () => {
  let service: FieldsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldsFormService);
  });

  describe('Service methods', () => {
    describe('createFieldsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFieldsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            fieldName: expect.any(Object),
            sourceId: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            createBy: expect.any(Object),
          }),
        );
      });

      it('passing IFields should create a new form with FormGroup', () => {
        const formGroup = service.createFieldsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            fieldName: expect.any(Object),
            sourceId: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            createBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getFields', () => {
      it('should return NewFields for default Fields initial value', () => {
        const formGroup = service.createFieldsFormGroup(sampleWithNewData);

        const fields = service.getFields(formGroup) as any;

        expect(fields).toMatchObject(sampleWithNewData);
      });

      it('should return NewFields for empty Fields initial value', () => {
        const formGroup = service.createFieldsFormGroup();

        const fields = service.getFields(formGroup) as any;

        expect(fields).toMatchObject({});
      });

      it('should return IFields', () => {
        const formGroup = service.createFieldsFormGroup(sampleWithRequiredData);

        const fields = service.getFields(formGroup) as any;

        expect(fields).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFields should not enable id FormControl', () => {
        const formGroup = service.createFieldsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFields should disable id FormControl', () => {
        const formGroup = service.createFieldsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
