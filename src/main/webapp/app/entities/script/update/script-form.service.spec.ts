import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../script.test-samples';

import { ScriptFormService } from './script-form.service';

describe('Script Form Service', () => {
  let service: ScriptFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptFormService);
  });

  describe('Service methods', () => {
    describe('createScriptFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createScriptFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            scriptCode: expect.any(Object),
            scriptName: expect.any(Object),
            timeStart: expect.any(Object),
            timeEnd: expect.any(Object),
            status: expect.any(Object),
            updateBy: expect.any(Object),
            frequency: expect.any(Object),
            subjectOfAssetmentPlan: expect.any(Object),
            codePlan: expect.any(Object),
            namePlan: expect.any(Object),
            timeCheck: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            participant: expect.any(Object),
          }),
        );
      });

      it('passing IScript should create a new form with FormGroup', () => {
        const formGroup = service.createScriptFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            scriptCode: expect.any(Object),
            scriptName: expect.any(Object),
            timeStart: expect.any(Object),
            timeEnd: expect.any(Object),
            status: expect.any(Object),
            updateBy: expect.any(Object),
            frequency: expect.any(Object),
            subjectOfAssetmentPlan: expect.any(Object),
            codePlan: expect.any(Object),
            namePlan: expect.any(Object),
            timeCheck: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            participant: expect.any(Object),
          }),
        );
      });
    });

    describe('getScript', () => {
      it('should return NewScript for default Script initial value', () => {
        const formGroup = service.createScriptFormGroup(sampleWithNewData);

        const script = service.getScript(formGroup) as any;

        expect(script).toMatchObject(sampleWithNewData);
      });

      it('should return NewScript for empty Script initial value', () => {
        const formGroup = service.createScriptFormGroup();

        const script = service.getScript(formGroup) as any;

        expect(script).toMatchObject({});
      });

      it('should return IScript', () => {
        const formGroup = service.createScriptFormGroup(sampleWithRequiredData);

        const script = service.getScript(formGroup) as any;

        expect(script).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IScript should not enable id FormControl', () => {
        const formGroup = service.createScriptFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewScript should disable id FormControl', () => {
        const formGroup = service.createScriptFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
