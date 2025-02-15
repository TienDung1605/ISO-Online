import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../inspection-report-titles.test-samples';

import { InspectionReportTitlesFormService } from './inspection-report-titles-form.service';

describe('InspectionReportTitles Form Service', () => {
  let service: InspectionReportTitlesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspectionReportTitlesFormService);
  });

  describe('Service methods', () => {
    describe('createInspectionReportTitlesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInspectionReportTitlesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nameTitle: expect.any(Object),
            source: expect.any(Object),
            field: expect.any(Object),
            dataType: expect.any(Object),
            timeCreate: expect.any(Object),
            timeUpdate: expect.any(Object),
            sampleReportId: expect.any(Object),
          }),
        );
      });

      it('passing IInspectionReportTitles should create a new form with FormGroup', () => {
        const formGroup = service.createInspectionReportTitlesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nameTitle: expect.any(Object),
            source: expect.any(Object),
            field: expect.any(Object),
            dataType: expect.any(Object),
            timeCreate: expect.any(Object),
            timeUpdate: expect.any(Object),
            sampleReportId: expect.any(Object),
          }),
        );
      });
    });

    describe('getInspectionReportTitles', () => {
      it('should return NewInspectionReportTitles for default InspectionReportTitles initial value', () => {
        const formGroup = service.createInspectionReportTitlesFormGroup(sampleWithNewData);

        const inspectionReportTitles = service.getInspectionReportTitles(formGroup) as any;

        expect(inspectionReportTitles).toMatchObject(sampleWithNewData);
      });

      it('should return NewInspectionReportTitles for empty InspectionReportTitles initial value', () => {
        const formGroup = service.createInspectionReportTitlesFormGroup();

        const inspectionReportTitles = service.getInspectionReportTitles(formGroup) as any;

        expect(inspectionReportTitles).toMatchObject({});
      });

      it('should return IInspectionReportTitles', () => {
        const formGroup = service.createInspectionReportTitlesFormGroup(sampleWithRequiredData);

        const inspectionReportTitles = service.getInspectionReportTitles(formGroup) as any;

        expect(inspectionReportTitles).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInspectionReportTitles should not enable id FormControl', () => {
        const formGroup = service.createInspectionReportTitlesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInspectionReportTitles should disable id FormControl', () => {
        const formGroup = service.createInspectionReportTitlesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
