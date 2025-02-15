import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../plan.test-samples';

import { PlanFormService } from './plan-form.service';

describe('Plan Form Service', () => {
  let service: PlanFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanFormService);
  });

  describe('Service methods', () => {
    describe('createPlanFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlanFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            name: expect.any(Object),
            subjectOfAssetmentPlan: expect.any(Object),
            frequency: expect.any(Object),
            timeStart: expect.any(Object),
            timeEnd: expect.any(Object),
            statusPlan: expect.any(Object),
            testObject: expect.any(Object),
            reportTypeId: expect.any(Object),
            reportTypeName: expect.any(Object),
            numberOfCheck: expect.any(Object),
            implementer: expect.any(Object),
            paticipant: expect.any(Object),
            checkerGroup: expect.any(Object),
            checkerName: expect.any(Object),
            checkerGroupId: expect.any(Object),
            checkerId: expect.any(Object),
            gross: expect.any(Object),
            timeCheck: expect.any(Object),
            nameResult: expect.any(Object),
            scriptId: expect.any(Object),
            createBy: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });

      it('passing IPlan should create a new form with FormGroup', () => {
        const formGroup = service.createPlanFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            name: expect.any(Object),
            subjectOfAssetmentPlan: expect.any(Object),
            frequency: expect.any(Object),
            timeStart: expect.any(Object),
            timeEnd: expect.any(Object),
            statusPlan: expect.any(Object),
            testObject: expect.any(Object),
            reportTypeId: expect.any(Object),
            reportTypeName: expect.any(Object),
            numberOfCheck: expect.any(Object),
            implementer: expect.any(Object),
            paticipant: expect.any(Object),
            checkerGroup: expect.any(Object),
            checkerName: expect.any(Object),
            checkerGroupId: expect.any(Object),
            checkerId: expect.any(Object),
            gross: expect.any(Object),
            timeCheck: expect.any(Object),
            nameResult: expect.any(Object),
            scriptId: expect.any(Object),
            createBy: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getPlan', () => {
      it('should return NewPlan for default Plan initial value', () => {
        const formGroup = service.createPlanFormGroup(sampleWithNewData);

        const plan = service.getPlan(formGroup) as any;

        expect(plan).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlan for empty Plan initial value', () => {
        const formGroup = service.createPlanFormGroup();

        const plan = service.getPlan(formGroup) as any;

        expect(plan).toMatchObject({});
      });

      it('should return IPlan', () => {
        const formGroup = service.createPlanFormGroup(sampleWithRequiredData);

        const plan = service.getPlan(formGroup) as any;

        expect(plan).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlan should not enable id FormControl', () => {
        const formGroup = service.createPlanFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlan should disable id FormControl', () => {
        const formGroup = service.createPlanFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
