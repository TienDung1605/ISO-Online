import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../checker-group.test-samples';

import { CheckerGroupFormService } from './checker-group-form.service';

describe('CheckerGroup Form Service', () => {
  let service: CheckerGroupFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckerGroupFormService);
  });

  describe('Service methods', () => {
    describe('createCheckerGroupFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCheckerGroupFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });

      it('passing ICheckerGroup should create a new form with FormGroup', () => {
        const formGroup = service.createCheckerGroupFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            updateBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getCheckerGroup', () => {
      it('should return NewCheckerGroup for default CheckerGroup initial value', () => {
        const formGroup = service.createCheckerGroupFormGroup(sampleWithNewData);

        const checkerGroup = service.getCheckerGroup(formGroup) as any;

        expect(checkerGroup).toMatchObject(sampleWithNewData);
      });

      it('should return NewCheckerGroup for empty CheckerGroup initial value', () => {
        const formGroup = service.createCheckerGroupFormGroup();

        const checkerGroup = service.getCheckerGroup(formGroup) as any;

        expect(checkerGroup).toMatchObject({});
      });

      it('should return ICheckerGroup', () => {
        const formGroup = service.createCheckerGroupFormGroup(sampleWithRequiredData);

        const checkerGroup = service.getCheckerGroup(formGroup) as any;

        expect(checkerGroup).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICheckerGroup should not enable id FormControl', () => {
        const formGroup = service.createCheckerGroupFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCheckerGroup should disable id FormControl', () => {
        const formGroup = service.createCheckerGroupFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
