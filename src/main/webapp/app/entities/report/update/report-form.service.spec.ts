import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../report.test-samples';

import { ReportFormService } from './report-form.service';

describe('Report Form Service', () => {
  let service: ReportFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportFormService);
  });

  describe('Service methods', () => {
    describe('createReportFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReportFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            code: expect.any(Object),
            sampleReportId: expect.any(Object),
            testOfObject: expect.any(Object),
            checker: expect.any(Object),
            status: expect.any(Object),
            frequency: expect.any(Object),
            reportType: expect.any(Object),
            reportTypeId: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            scoreScale: expect.any(Object),
            updateBy: expect.any(Object),
            planId: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IReport should create a new form with FormGroup', () => {
        const formGroup = service.createReportFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            code: expect.any(Object),
            sampleReportId: expect.any(Object),
            testOfObject: expect.any(Object),
            checker: expect.any(Object),
            status: expect.any(Object),
            frequency: expect.any(Object),
            reportType: expect.any(Object),
            reportTypeId: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            scoreScale: expect.any(Object),
            updateBy: expect.any(Object),
            planId: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getReport', () => {
      it('should return NewReport for default Report initial value', () => {
        const formGroup = service.createReportFormGroup(sampleWithNewData);

        const report = service.getReport(formGroup) as any;

        expect(report).toMatchObject(sampleWithNewData);
      });

      it('should return NewReport for empty Report initial value', () => {
        const formGroup = service.createReportFormGroup();

        const report = service.getReport(formGroup) as any;

        expect(report).toMatchObject({});
      });

      it('should return IReport', () => {
        const formGroup = service.createReportFormGroup(sampleWithRequiredData);

        const report = service.getReport(formGroup) as any;

        expect(report).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReport should not enable id FormControl', () => {
        const formGroup = service.createReportFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReport should disable id FormControl', () => {
        const formGroup = service.createReportFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
