import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sample-report.test-samples';

import { SampleReportFormService } from './sample-report-form.service';

describe('SampleReport Form Service', () => {
  let service: SampleReportFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleReportFormService);
  });

  describe('Service methods', () => {
    describe('createSampleReportFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSampleReportFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
            frequency: expect.any(Object),
            code: expect.any(Object),
            reportType: expect.any(Object),
            reportTypeId: expect.any(Object),
          }),
        );
      });

      it('passing ISampleReport should create a new form with FormGroup', () => {
        const formGroup = service.createSampleReportFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
            frequency: expect.any(Object),
            code: expect.any(Object),
            reportType: expect.any(Object),
            reportTypeId: expect.any(Object),
          }),
        );
      });
    });

    describe('getSampleReport', () => {
      it('should return NewSampleReport for default SampleReport initial value', () => {
        const formGroup = service.createSampleReportFormGroup(sampleWithNewData);

        const sampleReport = service.getSampleReport(formGroup) as any;

        expect(sampleReport).toMatchObject(sampleWithNewData);
      });

      it('should return NewSampleReport for empty SampleReport initial value', () => {
        const formGroup = service.createSampleReportFormGroup();

        const sampleReport = service.getSampleReport(formGroup) as any;

        expect(sampleReport).toMatchObject({});
      });

      it('should return ISampleReport', () => {
        const formGroup = service.createSampleReportFormGroup(sampleWithRequiredData);

        const sampleReport = service.getSampleReport(formGroup) as any;

        expect(sampleReport).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISampleReport should not enable id FormControl', () => {
        const formGroup = service.createSampleReportFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSampleReport should disable id FormControl', () => {
        const formGroup = service.createSampleReportFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
