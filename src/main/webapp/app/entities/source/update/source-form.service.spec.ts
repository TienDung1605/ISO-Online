import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../source.test-samples';

import { SourceFormService } from './source-form.service';

describe('Source Form Service', () => {
  let service: SourceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourceFormService);
  });

  describe('Service methods', () => {
    describe('createSourceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSourceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            source: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            createBy: expect.any(Object),
          }),
        );
      });

      it('passing ISource should create a new form with FormGroup', () => {
        const formGroup = service.createSourceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            source: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            createBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getSource', () => {
      it('should return NewSource for default Source initial value', () => {
        const formGroup = service.createSourceFormGroup(sampleWithNewData);

        const source = service.getSource(formGroup) as any;

        expect(source).toMatchObject(sampleWithNewData);
      });

      it('should return NewSource for empty Source initial value', () => {
        const formGroup = service.createSourceFormGroup();

        const source = service.getSource(formGroup) as any;

        expect(source).toMatchObject({});
      });

      it('should return ISource', () => {
        const formGroup = service.createSourceFormGroup(sampleWithRequiredData);

        const source = service.getSource(formGroup) as any;

        expect(source).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISource should not enable id FormControl', () => {
        const formGroup = service.createSourceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSource should disable id FormControl', () => {
        const formGroup = service.createSourceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
