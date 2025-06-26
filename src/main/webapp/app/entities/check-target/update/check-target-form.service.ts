import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICheckTarget, NewCheckTarget } from '../check-target.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICheckTarget for edit and NewCheckTargetFormGroupInput for create.
 */
type CheckTargetFormGroupInput = ICheckTarget | PartialWithRequiredKeyOf<NewCheckTarget>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICheckTarget | NewCheckTarget> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CheckTargetFormRawValue = FormValueOf<ICheckTarget>;

type NewCheckTargetFormRawValue = FormValueOf<NewCheckTarget>;

type CheckTargetFormDefaults = Pick<NewCheckTarget, 'id' | 'createdAt' | 'updatedAt'>;

type CheckTargetFormGroupContent = {
  id: FormControl<CheckTargetFormRawValue['id'] | NewCheckTarget['id']>;
  name: FormControl<CheckTargetFormRawValue['name']>;
  inspectionTarget: FormControl<CheckTargetFormRawValue['inspectionTarget']>;
  evaluationLevelId: FormControl<CheckTargetFormRawValue['evaluationLevelId']>;
  checkGroupId: FormControl<CheckTargetFormRawValue['checkGroupId']>;
  status: FormControl<CheckTargetFormRawValue['status']>;
  createdAt: FormControl<CheckTargetFormRawValue['createdAt']>;
  updatedAt: FormControl<CheckTargetFormRawValue['updatedAt']>;
  updateBy: FormControl<CheckTargetFormRawValue['updateBy']>;
};

export type CheckTargetFormGroup = FormGroup<CheckTargetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CheckTargetFormService {
  createCheckTargetFormGroup(checkTarget?: CheckTargetFormGroupInput): CheckTargetFormGroup {
    const checkTargetRawValue = this.convertCheckTargetToCheckTargetRawValue({
      ...this.getFormDefaults(),
      ...checkTarget,
    });

    return new FormGroup({
      id: new FormControl(
        { value: checkTargetRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(checkTargetRawValue.name, {
        validators: [Validators.required],
      }),
      inspectionTarget: new FormControl(checkTargetRawValue.inspectionTarget),
      evaluationLevelId: new FormControl(checkTargetRawValue.evaluationLevelId), // ✅ kiểu number
      checkGroupId: new FormControl(checkTargetRawValue.checkGroupId), // ✅ kiểu number
      status: new FormControl(checkTargetRawValue.status ?? 'ACTIVE'),
      createdAt: new FormControl(checkTargetRawValue.createdAt),
      updatedAt: new FormControl(checkTargetRawValue.updatedAt),
      updateBy: new FormControl(checkTargetRawValue.updateBy),
    }) as CheckTargetFormGroup;
  }

  getCheckTarget(form: CheckTargetFormGroup): ICheckTarget | NewCheckTarget {
    return this.convertCheckTargetRawValueToCheckTarget(form.getRawValue() as CheckTargetFormRawValue | NewCheckTargetFormRawValue);
  }

  resetForm(form: CheckTargetFormGroup, checkTarget: CheckTargetFormGroupInput): void {
    const checkTargetRawValue = this.convertCheckTargetToCheckTargetRawValue({
      ...this.getFormDefaults(),
      ...checkTarget,
    });

    form.reset(checkTargetRawValue);
    form.get('id')?.disable(); // 👈 Đặt disabled riêng sau
  }

  private getFormDefaults(): CheckTargetFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertCheckTargetRawValueToCheckTarget(
    rawCheckTarget: CheckTargetFormRawValue | NewCheckTargetFormRawValue,
  ): ICheckTarget | NewCheckTarget {
    return {
      ...rawCheckTarget,
      createdAt: dayjs(rawCheckTarget.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawCheckTarget.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertCheckTargetToCheckTargetRawValue(
    checkTarget: ICheckTarget | (Partial<NewCheckTarget> & CheckTargetFormDefaults),
  ): CheckTargetFormRawValue | PartialWithRequiredKeyOf<NewCheckTargetFormRawValue> {
    return {
      ...checkTarget,
      evaluationLevelId: checkTarget.evaluationLevelId != null ? +checkTarget.evaluationLevelId : null,
      checkGroupId: checkTarget.checkGroupId != null ? +checkTarget.checkGroupId : null,
      createdAt: checkTarget.createdAt ? checkTarget.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: checkTarget.updatedAt ? checkTarget.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
