import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../report-type.test-samples';

import { ReportTypeFormService } from './report-type-form.service';

describe('ReportType Form Service', () => {
  let service: ReportTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportTypeFormService);
  });

  describe('Service methods', () => {
    describe('createReportTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReportTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });

      it('passing IReportType should create a new form with FormGroup', () => {
        const formGroup = service.createReportTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getReportType', () => {
      it('should return NewReportType for default ReportType initial value', () => {
        const formGroup = service.createReportTypeFormGroup(sampleWithNewData);

        const reportType = service.getReportType(formGroup) as any;

        expect(reportType).toMatchObject(sampleWithNewData);
      });

      it('should return NewReportType for empty ReportType initial value', () => {
        const formGroup = service.createReportTypeFormGroup();

        const reportType = service.getReportType(formGroup) as any;

        expect(reportType).toMatchObject({});
      });

      it('should return IReportType', () => {
        const formGroup = service.createReportTypeFormGroup(sampleWithRequiredData);

        const reportType = service.getReportType(formGroup) as any;

        expect(reportType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReportType should not enable id FormControl', () => {
        const formGroup = service.createReportTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReportType should disable id FormControl', () => {
        const formGroup = service.createReportTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
