import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../check-target.test-samples';

import { CheckTargetFormService } from './check-target-form.service';

describe('CheckTarget Form Service', () => {
  let service: CheckTargetFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckTargetFormService);
  });

  describe('Service methods', () => {
    describe('createCheckTargetFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCheckTargetFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            inspectionTarget: expect.any(Object),
            evaluationLevelId: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });

      it('passing ICheckTarget should create a new form with FormGroup', () => {
        const formGroup = service.createCheckTargetFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            inspectionTarget: expect.any(Object),
            evaluationLevelId: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getCheckTarget', () => {
      it('should return NewCheckTarget for default CheckTarget initial value', () => {
        const formGroup = service.createCheckTargetFormGroup(sampleWithNewData);

        const checkTarget = service.getCheckTarget(formGroup) as any;

        expect(checkTarget).toMatchObject(sampleWithNewData);
      });

      it('should return NewCheckTarget for empty CheckTarget initial value', () => {
        const formGroup = service.createCheckTargetFormGroup();

        const checkTarget = service.getCheckTarget(formGroup) as any;

        expect(checkTarget).toMatchObject({});
      });

      it('should return ICheckTarget', () => {
        const formGroup = service.createCheckTargetFormGroup(sampleWithRequiredData);

        const checkTarget = service.getCheckTarget(formGroup) as any;

        expect(checkTarget).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICheckTarget should not enable id FormControl', () => {
        const formGroup = service.createCheckTargetFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCheckTarget should disable id FormControl', () => {
        const formGroup = service.createCheckTargetFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
