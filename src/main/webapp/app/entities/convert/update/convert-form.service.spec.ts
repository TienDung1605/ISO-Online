import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../convert.test-samples';

import { ConvertFormService } from './convert-form.service';

describe('Convert Form Service', () => {
  let service: ConvertFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertFormService);
  });

  describe('Service methods', () => {
    describe('createConvertFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createConvertFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            mark: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
            score: expect.any(Object),
            count: expect.any(Object),
          }),
        );
      });

      it('passing IConvert should create a new form with FormGroup', () => {
        const formGroup = service.createConvertFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            mark: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
            score: expect.any(Object),
            count: expect.any(Object),
          }),
        );
      });
    });

    describe('getConvert', () => {
      it('should return NewConvert for default Convert initial value', () => {
        const formGroup = service.createConvertFormGroup(sampleWithNewData);

        const convert = service.getConvert(formGroup) as any;

        expect(convert).toMatchObject(sampleWithNewData);
      });

      it('should return NewConvert for empty Convert initial value', () => {
        const formGroup = service.createConvertFormGroup();

        const convert = service.getConvert(formGroup) as any;

        expect(convert).toMatchObject({});
      });

      it('should return IConvert', () => {
        const formGroup = service.createConvertFormGroup(sampleWithRequiredData);

        const convert = service.getConvert(formGroup) as any;

        expect(convert).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConvert should not enable id FormControl', () => {
        const formGroup = service.createConvertFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConvert should disable id FormControl', () => {
        const formGroup = service.createConvertFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
