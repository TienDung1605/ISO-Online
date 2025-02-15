import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IScript, NewScript } from '../script.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IScript for edit and NewScriptFormGroupInput for create.
 */
type ScriptFormGroupInput = IScript | PartialWithRequiredKeyOf<NewScript>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IScript | NewScript> = Omit<T, 'timeStart' | 'timeEnd' | 'timeCheck' | 'createdAt' | 'updatedAt'> & {
  timeStart?: string | null;
  timeEnd?: string | null;
  timeCheck?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ScriptFormRawValue = FormValueOf<IScript>;

type NewScriptFormRawValue = FormValueOf<NewScript>;

type ScriptFormDefaults = Pick<NewScript, 'id' | 'timeStart' | 'timeEnd' | 'timeCheck' | 'createdAt' | 'updatedAt'>;

type ScriptFormGroupContent = {
  id: FormControl<ScriptFormRawValue['id'] | NewScript['id']>;
  scriptCode: FormControl<ScriptFormRawValue['scriptCode']>;
  scriptName: FormControl<ScriptFormRawValue['scriptName']>;
  timeStart: FormControl<ScriptFormRawValue['timeStart']>;
  timeEnd: FormControl<ScriptFormRawValue['timeEnd']>;
  status: FormControl<ScriptFormRawValue['status']>;
  updateBy: FormControl<ScriptFormRawValue['updateBy']>;
  frequency: FormControl<ScriptFormRawValue['frequency']>;
  subjectOfAssetmentPlan: FormControl<ScriptFormRawValue['subjectOfAssetmentPlan']>;
  codePlan: FormControl<ScriptFormRawValue['codePlan']>;
  namePlan: FormControl<ScriptFormRawValue['namePlan']>;
  timeCheck: FormControl<ScriptFormRawValue['timeCheck']>;
  createdAt: FormControl<ScriptFormRawValue['createdAt']>;
  updatedAt: FormControl<ScriptFormRawValue['updatedAt']>;
  participant: FormControl<ScriptFormRawValue['participant']>;
};

export type ScriptFormGroup = FormGroup<ScriptFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ScriptFormService {
  createScriptFormGroup(script: ScriptFormGroupInput = { id: null }): ScriptFormGroup {
    const scriptRawValue = this.convertScriptToScriptRawValue({
      ...this.getFormDefaults(),
      ...script,
    });
    return new FormGroup<ScriptFormGroupContent>({
      id: new FormControl(
        { value: scriptRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      scriptCode: new FormControl(scriptRawValue.scriptCode),
      scriptName: new FormControl(scriptRawValue.scriptName),
      timeStart: new FormControl(scriptRawValue.timeStart),
      timeEnd: new FormControl(scriptRawValue.timeEnd),
      status: new FormControl(scriptRawValue.status),
      updateBy: new FormControl(scriptRawValue.updateBy),
      frequency: new FormControl(scriptRawValue.frequency),
      subjectOfAssetmentPlan: new FormControl(scriptRawValue.subjectOfAssetmentPlan),
      codePlan: new FormControl(scriptRawValue.codePlan),
      namePlan: new FormControl(scriptRawValue.namePlan),
      timeCheck: new FormControl(scriptRawValue.timeCheck),
      createdAt: new FormControl(scriptRawValue.createdAt),
      updatedAt: new FormControl(scriptRawValue.updatedAt),
      participant: new FormControl(scriptRawValue.participant),
    });
  }

  getScript(form: ScriptFormGroup): IScript | NewScript {
    return this.convertScriptRawValueToScript(form.getRawValue() as ScriptFormRawValue | NewScriptFormRawValue);
  }

  resetForm(form: ScriptFormGroup, script: ScriptFormGroupInput): void {
    const scriptRawValue = this.convertScriptToScriptRawValue({ ...this.getFormDefaults(), ...script });
    form.reset(
      {
        ...scriptRawValue,
        id: { value: scriptRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ScriptFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timeStart: currentTime,
      timeEnd: currentTime,
      timeCheck: currentTime,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertScriptRawValueToScript(rawScript: ScriptFormRawValue | NewScriptFormRawValue): IScript | NewScript {
    return {
      ...rawScript,
      timeStart: dayjs(rawScript.timeStart, DATE_TIME_FORMAT),
      timeEnd: dayjs(rawScript.timeEnd, DATE_TIME_FORMAT),
      timeCheck: dayjs(rawScript.timeCheck, DATE_TIME_FORMAT),
      createdAt: dayjs(rawScript.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawScript.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertScriptToScriptRawValue(
    script: IScript | (Partial<NewScript> & ScriptFormDefaults),
  ): ScriptFormRawValue | PartialWithRequiredKeyOf<NewScriptFormRawValue> {
    return {
      ...script,
      timeStart: script.timeStart ? script.timeStart.format(DATE_TIME_FORMAT) : undefined,
      timeEnd: script.timeEnd ? script.timeEnd.format(DATE_TIME_FORMAT) : undefined,
      timeCheck: script.timeCheck ? script.timeCheck.format(DATE_TIME_FORMAT) : undefined,
      createdAt: script.createdAt ? script.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: script.updatedAt ? script.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
