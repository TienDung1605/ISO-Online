import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../parts.test-samples';

import { PartsFormService } from './parts-form.service';

describe('Parts Form Service', () => {
  let service: PartsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartsFormService);
  });

  describe('Service methods', () => {
    describe('createPartsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPartsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });

      it('passing IParts should create a new form with FormGroup', () => {
        const formGroup = service.createPartsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getParts', () => {
      it('should return NewParts for default Parts initial value', () => {
        const formGroup = service.createPartsFormGroup(sampleWithNewData);

        const parts = service.getParts(formGroup) as any;

        expect(parts).toMatchObject(sampleWithNewData);
      });

      it('should return NewParts for empty Parts initial value', () => {
        const formGroup = service.createPartsFormGroup();

        const parts = service.getParts(formGroup) as any;

        expect(parts).toMatchObject({});
      });

      it('should return IParts', () => {
        const formGroup = service.createPartsFormGroup(sampleWithRequiredData);

        const parts = service.getParts(formGroup) as any;

        expect(parts).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IParts should not enable id FormControl', () => {
        const formGroup = service.createPartsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewParts should disable id FormControl', () => {
        const formGroup = service.createPartsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
