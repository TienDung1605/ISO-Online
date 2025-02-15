import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICriteriaGroup, NewCriteriaGroup } from '../criteria-group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICriteriaGroup for edit and NewCriteriaGroupFormGroupInput for create.
 */
type CriteriaGroupFormGroupInput = ICriteriaGroup | PartialWithRequiredKeyOf<NewCriteriaGroup>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICriteriaGroup | NewCriteriaGroup> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CriteriaGroupFormRawValue = FormValueOf<ICriteriaGroup>;

type NewCriteriaGroupFormRawValue = FormValueOf<NewCriteriaGroup>;

type CriteriaGroupFormDefaults = Pick<NewCriteriaGroup, 'id' | 'createdAt' | 'updatedAt'>;

type CriteriaGroupFormGroupContent = {
  id: FormControl<CriteriaGroupFormRawValue['id'] | NewCriteriaGroup['id']>;
  name: FormControl<CriteriaGroupFormRawValue['name']>;
  status: FormControl<CriteriaGroupFormRawValue['status']>;
  createdAt: FormControl<CriteriaGroupFormRawValue['createdAt']>;
  updatedAt: FormControl<CriteriaGroupFormRawValue['updatedAt']>;
  updateBy: FormControl<CriteriaGroupFormRawValue['updateBy']>;
};

export type CriteriaGroupFormGroup = FormGroup<CriteriaGroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CriteriaGroupFormService {
  createCriteriaGroupFormGroup(criteriaGroup: CriteriaGroupFormGroupInput = { id: null }): CriteriaGroupFormGroup {
    const criteriaGroupRawValue = this.convertCriteriaGroupToCriteriaGroupRawValue({
      ...this.getFormDefaults(),
      ...criteriaGroup,
    });
    return new FormGroup<CriteriaGroupFormGroupContent>({
      id: new FormControl(
        { value: criteriaGroupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(criteriaGroupRawValue.name),
      status: new FormControl(criteriaGroupRawValue.status),
      createdAt: new FormControl(criteriaGroupRawValue.createdAt),
      updatedAt: new FormControl(criteriaGroupRawValue.updatedAt),
      updateBy: new FormControl(criteriaGroupRawValue.updateBy),
    });
  }

  getCriteriaGroup(form: CriteriaGroupFormGroup): ICriteriaGroup | NewCriteriaGroup {
    return this.convertCriteriaGroupRawValueToCriteriaGroup(form.getRawValue() as CriteriaGroupFormRawValue | NewCriteriaGroupFormRawValue);
  }

  resetForm(form: CriteriaGroupFormGroup, criteriaGroup: CriteriaGroupFormGroupInput): void {
    const criteriaGroupRawValue = this.convertCriteriaGroupToCriteriaGroupRawValue({ ...this.getFormDefaults(), ...criteriaGroup });
    form.reset(
      {
        ...criteriaGroupRawValue,
        id: { value: criteriaGroupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CriteriaGroupFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertCriteriaGroupRawValueToCriteriaGroup(
    rawCriteriaGroup: CriteriaGroupFormRawValue | NewCriteriaGroupFormRawValue,
  ): ICriteriaGroup | NewCriteriaGroup {
    return {
      ...rawCriteriaGroup,
      createdAt: dayjs(rawCriteriaGroup.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawCriteriaGroup.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertCriteriaGroupToCriteriaGroupRawValue(
    criteriaGroup: ICriteriaGroup | (Partial<NewCriteriaGroup> & CriteriaGroupFormDefaults),
  ): CriteriaGroupFormRawValue | PartialWithRequiredKeyOf<NewCriteriaGroupFormRawValue> {
    return {
      ...criteriaGroup,
      createdAt: criteriaGroup.createdAt ? criteriaGroup.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: criteriaGroup.updatedAt ? criteriaGroup.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
