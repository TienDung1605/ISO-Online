import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../title.test-samples';

import { TitleFormService } from './title-form.service';

describe('Title Form Service', () => {
  let service: TitleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleFormService);
  });

  describe('Service methods', () => {
    describe('createTitleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTitleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            source: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            dataType: expect.any(Object),
            updateBy: expect.any(Object),
            field: expect.any(Object),
          }),
        );
      });

      it('passing ITitle should create a new form with FormGroup', () => {
        const formGroup = service.createTitleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            source: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            dataType: expect.any(Object),
            updateBy: expect.any(Object),
            field: expect.any(Object),
          }),
        );
      });
    });

    describe('getTitle', () => {
      it('should return NewTitle for default Title initial value', () => {
        const formGroup = service.createTitleFormGroup(sampleWithNewData);

        const title = service.getTitle(formGroup) as any;

        expect(title).toMatchObject(sampleWithNewData);
      });

      it('should return NewTitle for empty Title initial value', () => {
        const formGroup = service.createTitleFormGroup();

        const title = service.getTitle(formGroup) as any;

        expect(title).toMatchObject({});
      });

      it('should return ITitle', () => {
        const formGroup = service.createTitleFormGroup(sampleWithRequiredData);

        const title = service.getTitle(formGroup) as any;

        expect(title).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITitle should not enable id FormControl', () => {
        const formGroup = service.createTitleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTitle should disable id FormControl', () => {
        const formGroup = service.createTitleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
