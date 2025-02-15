import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../report-criteria.test-samples';

import { ReportCriteriaFormService } from './report-criteria-form.service';

describe('ReportCriteria Form Service', () => {
  let service: ReportCriteriaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportCriteriaFormService);
  });

  describe('Service methods', () => {
    describe('createReportCriteriaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReportCriteriaFormGroup();

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
            reportId: expect.any(Object),
          }),
        );
      });

      it('passing IReportCriteria should create a new form with FormGroup', () => {
        const formGroup = service.createReportCriteriaFormGroup(sampleWithRequiredData);

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
            reportId: expect.any(Object),
          }),
        );
      });
    });

    describe('getReportCriteria', () => {
      it('should return NewReportCriteria for default ReportCriteria initial value', () => {
        const formGroup = service.createReportCriteriaFormGroup(sampleWithNewData);

        const reportCriteria = service.getReportCriteria(formGroup) as any;

        expect(reportCriteria).toMatchObject(sampleWithNewData);
      });

      it('should return NewReportCriteria for empty ReportCriteria initial value', () => {
        const formGroup = service.createReportCriteriaFormGroup();

        const reportCriteria = service.getReportCriteria(formGroup) as any;

        expect(reportCriteria).toMatchObject({});
      });

      it('should return IReportCriteria', () => {
        const formGroup = service.createReportCriteriaFormGroup(sampleWithRequiredData);

        const reportCriteria = service.getReportCriteria(formGroup) as any;

        expect(reportCriteria).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReportCriteria should not enable id FormControl', () => {
        const formGroup = service.createReportCriteriaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReportCriteria should disable id FormControl', () => {
        const formGroup = service.createReportCriteriaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
