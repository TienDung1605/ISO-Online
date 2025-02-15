import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sample-report-criteria.test-samples';

import { SampleReportCriteriaFormService } from './sample-report-criteria-form.service';

describe('SampleReportCriteria Form Service', () => {
  let service: SampleReportCriteriaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleReportCriteriaFormService);
  });

  describe('Service methods', () => {
    describe('createSampleReportCriteriaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSampleReportCriteriaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            criteriaName: expect.any(Object),
            criteriaGroupName: expect.any(Object),
            criteriaId: expect.any(Object),
            criteriaGroupId: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
            frequency: expect.any(Object),
            sampleReportId: expect.any(Object),
            detail: expect.any(Object),
          }),
        );
      });

      it('passing ISampleReportCriteria should create a new form with FormGroup', () => {
        const formGroup = service.createSampleReportCriteriaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            criteriaName: expect.any(Object),
            criteriaGroupName: expect.any(Object),
            criteriaId: expect.any(Object),
            criteriaGroupId: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
            frequency: expect.any(Object),
            sampleReportId: expect.any(Object),
            detail: expect.any(Object),
          }),
        );
      });
    });

    describe('getSampleReportCriteria', () => {
      it('should return NewSampleReportCriteria for default SampleReportCriteria initial value', () => {
        const formGroup = service.createSampleReportCriteriaFormGroup(sampleWithNewData);

        const sampleReportCriteria = service.getSampleReportCriteria(formGroup) as any;

        expect(sampleReportCriteria).toMatchObject(sampleWithNewData);
      });

      it('should return NewSampleReportCriteria for empty SampleReportCriteria initial value', () => {
        const formGroup = service.createSampleReportCriteriaFormGroup();

        const sampleReportCriteria = service.getSampleReportCriteria(formGroup) as any;

        expect(sampleReportCriteria).toMatchObject({});
      });

      it('should return ISampleReportCriteria', () => {
        const formGroup = service.createSampleReportCriteriaFormGroup(sampleWithRequiredData);

        const sampleReportCriteria = service.getSampleReportCriteria(formGroup) as any;

        expect(sampleReportCriteria).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISampleReportCriteria should not enable id FormControl', () => {
        const formGroup = service.createSampleReportCriteriaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSampleReportCriteria should disable id FormControl', () => {
        const formGroup = service.createSampleReportCriteriaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
