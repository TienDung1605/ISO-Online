import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICheckerGroup, NewCheckerGroup } from '../checker-group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICheckerGroup for edit and NewCheckerGroupFormGroupInput for create.
 */
type CheckerGroupFormGroupInput = ICheckerGroup | PartialWithRequiredKeyOf<NewCheckerGroup>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICheckerGroup | NewCheckerGroup> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CheckerGroupFormRawValue = FormValueOf<ICheckerGroup>;

type NewCheckerGroupFormRawValue = FormValueOf<NewCheckerGroup>;

type CheckerGroupFormDefaults = Pick<NewCheckerGroup, 'id' | 'createdAt' | 'updatedAt'>;

type CheckerGroupFormGroupContent = {
  id: FormControl<CheckerGroupFormRawValue['id'] | NewCheckerGroup['id']>;
  name: FormControl<CheckerGroupFormRawValue['name']>;
  status: FormControl<CheckerGroupFormRawValue['status']>;
  createdAt: FormControl<CheckerGroupFormRawValue['createdAt']>;
  updatedAt: FormControl<CheckerGroupFormRawValue['updatedAt']>;
  updateBy: FormControl<CheckerGroupFormRawValue['updateBy']>;
};

export type CheckerGroupFormGroup = FormGroup<CheckerGroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CheckerGroupFormService {
  createCheckerGroupFormGroup(checkerGroup: CheckerGroupFormGroupInput = { id: null }): CheckerGroupFormGroup {
    const checkerGroupRawValue = this.convertCheckerGroupToCheckerGroupRawValue({
      ...this.getFormDefaults(),
      ...checkerGroup,
    });
    return new FormGroup<CheckerGroupFormGroupContent>({
      id: new FormControl(
        { value: checkerGroupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(checkerGroupRawValue.name),
      status: new FormControl(checkerGroupRawValue.status),
      createdAt: new FormControl(checkerGroupRawValue.createdAt),
      updatedAt: new FormControl(checkerGroupRawValue.updatedAt),
      updateBy: new FormControl(checkerGroupRawValue.updateBy),
    });
  }

  getCheckerGroup(form: CheckerGroupFormGroup): ICheckerGroup | NewCheckerGroup {
    return this.convertCheckerGroupRawValueToCheckerGroup(form.getRawValue() as CheckerGroupFormRawValue | NewCheckerGroupFormRawValue);
  }

  resetForm(form: CheckerGroupFormGroup, checkerGroup: CheckerGroupFormGroupInput): void {
    const checkerGroupRawValue = this.convertCheckerGroupToCheckerGroupRawValue({ ...this.getFormDefaults(), ...checkerGroup });
    form.reset(
      {
        ...checkerGroupRawValue,
        id: { value: checkerGroupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CheckerGroupFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertCheckerGroupRawValueToCheckerGroup(
    rawCheckerGroup: CheckerGroupFormRawValue | NewCheckerGroupFormRawValue,
  ): ICheckerGroup | NewCheckerGroup {
    return {
      ...rawCheckerGroup,
      createdAt: dayjs(rawCheckerGroup.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawCheckerGroup.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertCheckerGroupToCheckerGroupRawValue(
    checkerGroup: ICheckerGroup | (Partial<NewCheckerGroup> & CheckerGroupFormDefaults),
  ): CheckerGroupFormRawValue | PartialWithRequiredKeyOf<NewCheckerGroupFormRawValue> {
    return {
      ...checkerGroup,
      createdAt: checkerGroup.createdAt ? checkerGroup.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: checkerGroup.updatedAt ? checkerGroup.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
