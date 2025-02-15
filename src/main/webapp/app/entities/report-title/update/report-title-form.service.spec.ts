import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../report-title.test-samples';

import { ReportTitleFormService } from './report-title-form.service';

describe('ReportTitle Form Service', () => {
  let service: ReportTitleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportTitleFormService);
  });

  describe('Service methods', () => {
    describe('createReportTitleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReportTitleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            source: expect.any(Object),
            field: expect.any(Object),
            dataType: expect.any(Object),
            index: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
            reportId: expect.any(Object),
          }),
        );
      });

      it('passing IReportTitle should create a new form with FormGroup', () => {
        const formGroup = service.createReportTitleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            source: expect.any(Object),
            field: expect.any(Object),
            dataType: expect.any(Object),
            index: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
            reportId: expect.any(Object),
          }),
        );
      });
    });

    describe('getReportTitle', () => {
      it('should return NewReportTitle for default ReportTitle initial value', () => {
        const formGroup = service.createReportTitleFormGroup(sampleWithNewData);

        const reportTitle = service.getReportTitle(formGroup) as any;

        expect(reportTitle).toMatchObject(sampleWithNewData);
      });

      it('should return NewReportTitle for empty ReportTitle initial value', () => {
        const formGroup = service.createReportTitleFormGroup();

        const reportTitle = service.getReportTitle(formGroup) as any;

        expect(reportTitle).toMatchObject({});
      });

      it('should return IReportTitle', () => {
        const formGroup = service.createReportTitleFormGroup(sampleWithRequiredData);

        const reportTitle = service.getReportTitle(formGroup) as any;

        expect(reportTitle).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReportTitle should not enable id FormControl', () => {
        const formGroup = service.createReportTitleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReportTitle should disable id FormControl', () => {
        const formGroup = service.createReportTitleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
