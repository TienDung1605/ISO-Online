import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../criteria-group.test-samples';

import { CriteriaGroupFormService } from './criteria-group-form.service';

describe('CriteriaGroup Form Service', () => {
  let service: CriteriaGroupFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteriaGroupFormService);
  });

  describe('Service methods', () => {
    describe('createCriteriaGroupFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCriteriaGroupFormGroup();

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

      it('passing ICriteriaGroup should create a new form with FormGroup', () => {
        const formGroup = service.createCriteriaGroupFormGroup(sampleWithRequiredData);

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

    describe('getCriteriaGroup', () => {
      it('should return NewCriteriaGroup for default CriteriaGroup initial value', () => {
        const formGroup = service.createCriteriaGroupFormGroup(sampleWithNewData);

        const criteriaGroup = service.getCriteriaGroup(formGroup) as any;

        expect(criteriaGroup).toMatchObject(sampleWithNewData);
      });

      it('should return NewCriteriaGroup for empty CriteriaGroup initial value', () => {
        const formGroup = service.createCriteriaGroupFormGroup();

        const criteriaGroup = service.getCriteriaGroup(formGroup) as any;

        expect(criteriaGroup).toMatchObject({});
      });

      it('should return ICriteriaGroup', () => {
        const formGroup = service.createCriteriaGroupFormGroup(sampleWithRequiredData);

        const criteriaGroup = service.getCriteriaGroup(formGroup) as any;

        expect(criteriaGroup).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICriteriaGroup should not enable id FormControl', () => {
        const formGroup = service.createCriteriaGroupFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCriteriaGroup should disable id FormControl', () => {
        const formGroup = service.createCriteriaGroupFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
