import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../check-level.test-samples';

import { CheckLevelFormService } from './check-level-form.service';

describe('CheckLevel Form Service', () => {
  let service: CheckLevelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckLevelFormService);
  });

  describe('Service methods', () => {
    describe('createCheckLevelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCheckLevelFormGroup();

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

      it('passing ICheckLevel should create a new form with FormGroup', () => {
        const formGroup = service.createCheckLevelFormGroup(sampleWithRequiredData);

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

    describe('getCheckLevel', () => {
      it('should return NewCheckLevel for default CheckLevel initial value', () => {
        const formGroup = service.createCheckLevelFormGroup(sampleWithNewData);

        const checkLevel = service.getCheckLevel(formGroup) as any;

        expect(checkLevel).toMatchObject(sampleWithNewData);
      });

      it('should return NewCheckLevel for empty CheckLevel initial value', () => {
        const formGroup = service.createCheckLevelFormGroup();

        const checkLevel = service.getCheckLevel(formGroup) as any;

        expect(checkLevel).toMatchObject({});
      });

      it('should return ICheckLevel', () => {
        const formGroup = service.createCheckLevelFormGroup(sampleWithRequiredData);

        const checkLevel = service.getCheckLevel(formGroup) as any;

        expect(checkLevel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICheckLevel should not enable id FormControl', () => {
        const formGroup = service.createCheckLevelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCheckLevel should disable id FormControl', () => {
        const formGroup = service.createCheckLevelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
