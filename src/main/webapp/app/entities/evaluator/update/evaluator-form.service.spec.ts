import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../evaluator.test-samples';

import { EvaluatorFormService } from './evaluator-form.service';

describe('Evaluator Form Service', () => {
  let service: EvaluatorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluatorFormService);
  });

  describe('Service methods', () => {
    describe('createEvaluatorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEvaluatorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            userGroupId: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            status: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });

      it('passing IEvaluator should create a new form with FormGroup', () => {
        const formGroup = service.createEvaluatorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            userGroupId: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            status: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getEvaluator', () => {
      it('should return NewEvaluator for default Evaluator initial value', () => {
        const formGroup = service.createEvaluatorFormGroup(sampleWithNewData);

        const evaluator = service.getEvaluator(formGroup) as any;

        expect(evaluator).toMatchObject(sampleWithNewData);
      });

      it('should return NewEvaluator for empty Evaluator initial value', () => {
        const formGroup = service.createEvaluatorFormGroup();

        const evaluator = service.getEvaluator(formGroup) as any;

        expect(evaluator).toMatchObject({});
      });

      it('should return IEvaluator', () => {
        const formGroup = service.createEvaluatorFormGroup(sampleWithRequiredData);

        const evaluator = service.getEvaluator(formGroup) as any;

        expect(evaluator).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEvaluator should not enable id FormControl', () => {
        const formGroup = service.createEvaluatorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEvaluator should disable id FormControl', () => {
        const formGroup = service.createEvaluatorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
