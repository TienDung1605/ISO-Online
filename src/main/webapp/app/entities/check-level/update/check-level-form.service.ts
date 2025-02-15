import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICheckLevel, NewCheckLevel } from '../check-level.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICheckLevel for edit and NewCheckLevelFormGroupInput for create.
 */
type CheckLevelFormGroupInput = ICheckLevel | PartialWithRequiredKeyOf<NewCheckLevel>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICheckLevel | NewCheckLevel> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CheckLevelFormRawValue = FormValueOf<ICheckLevel>;

type NewCheckLevelFormRawValue = FormValueOf<NewCheckLevel>;

type CheckLevelFormDefaults = Pick<NewCheckLevel, 'id' | 'createdAt' | 'updatedAt'>;

type CheckLevelFormGroupContent = {
  id: FormControl<CheckLevelFormRawValue['id'] | NewCheckLevel['id']>;
  name: FormControl<CheckLevelFormRawValue['name']>;
  status: FormControl<CheckLevelFormRawValue['status']>;
  createdAt: FormControl<CheckLevelFormRawValue['createdAt']>;
  updatedAt: FormControl<CheckLevelFormRawValue['updatedAt']>;
  updateBy: FormControl<CheckLevelFormRawValue['updateBy']>;
};

export type CheckLevelFormGroup = FormGroup<CheckLevelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CheckLevelFormService {
  createCheckLevelFormGroup(checkLevel: CheckLevelFormGroupInput = { id: null }): CheckLevelFormGroup {
    const checkLevelRawValue = this.convertCheckLevelToCheckLevelRawValue({
      ...this.getFormDefaults(),
      ...checkLevel,
    });
    return new FormGroup<CheckLevelFormGroupContent>({
      id: new FormControl(
        { value: checkLevelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(checkLevelRawValue.name),
      status: new FormControl(checkLevelRawValue.status),
      createdAt: new FormControl(checkLevelRawValue.createdAt),
      updatedAt: new FormControl(checkLevelRawValue.updatedAt),
      updateBy: new FormControl(checkLevelRawValue.updateBy),
    });
  }

  getCheckLevel(form: CheckLevelFormGroup): ICheckLevel | NewCheckLevel {
    return this.convertCheckLevelRawValueToCheckLevel(form.getRawValue() as CheckLevelFormRawValue | NewCheckLevelFormRawValue);
  }

  resetForm(form: CheckLevelFormGroup, checkLevel: CheckLevelFormGroupInput): void {
    const checkLevelRawValue = this.convertCheckLevelToCheckLevelRawValue({ ...this.getFormDefaults(), ...checkLevel });
    form.reset(
      {
        ...checkLevelRawValue,
        id: { value: checkLevelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CheckLevelFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertCheckLevelRawValueToCheckLevel(
    rawCheckLevel: CheckLevelFormRawValue | NewCheckLevelFormRawValue,
  ): ICheckLevel | NewCheckLevel {
    return {
      ...rawCheckLevel,
      createdAt: dayjs(rawCheckLevel.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawCheckLevel.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertCheckLevelToCheckLevelRawValue(
    checkLevel: ICheckLevel | (Partial<NewCheckLevel> & CheckLevelFormDefaults),
  ): CheckLevelFormRawValue | PartialWithRequiredKeyOf<NewCheckLevelFormRawValue> {
    return {
      ...checkLevel,
      createdAt: checkLevel.createdAt ? checkLevel.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: checkLevel.updatedAt ? checkLevel.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
