import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICriteria, NewCriteria } from '../criteria.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICriteria for edit and NewCriteriaFormGroupInput for create.
 */
type CriteriaFormGroupInput = ICriteria | PartialWithRequiredKeyOf<NewCriteria>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICriteria | NewCriteria> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CriteriaFormRawValue = FormValueOf<ICriteria>;

type NewCriteriaFormRawValue = FormValueOf<NewCriteria>;

type CriteriaFormDefaults = Pick<NewCriteria, 'id' | 'createdAt' | 'updatedAt'>;

type CriteriaFormGroupContent = {
  id: FormControl<CriteriaFormRawValue['id'] | NewCriteria['id']>;
  name: FormControl<CriteriaFormRawValue['name']>;
  criterialGroupId: FormControl<CriteriaFormRawValue['criterialGroupId']>;
  status: FormControl<CriteriaFormRawValue['status']>;
  createdAt: FormControl<CriteriaFormRawValue['createdAt']>;
  updatedAt: FormControl<CriteriaFormRawValue['updatedAt']>;
  updateBy: FormControl<CriteriaFormRawValue['updateBy']>;
};

export type CriteriaFormGroup = FormGroup<CriteriaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CriteriaFormService {
  createCriteriaFormGroup(criteria: CriteriaFormGroupInput = { id: null }): CriteriaFormGroup {
    const criteriaRawValue = this.convertCriteriaToCriteriaRawValue({
      ...this.getFormDefaults(),
      ...criteria,
    });
    return new FormGroup<CriteriaFormGroupContent>({
      id: new FormControl(
        { value: criteriaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(criteriaRawValue.name),
      criterialGroupId: new FormControl(criteriaRawValue.criterialGroupId),
      status: new FormControl(criteriaRawValue.status),
      createdAt: new FormControl(criteriaRawValue.createdAt),
      updatedAt: new FormControl(criteriaRawValue.updatedAt),
      updateBy: new FormControl(criteriaRawValue.updateBy),
    });
  }

  getCriteria(form: CriteriaFormGroup): ICriteria | NewCriteria {
    return this.convertCriteriaRawValueToCriteria(form.getRawValue() as CriteriaFormRawValue | NewCriteriaFormRawValue);
  }

  resetForm(form: CriteriaFormGroup, criteria: CriteriaFormGroupInput): void {
    const criteriaRawValue = this.convertCriteriaToCriteriaRawValue({ ...this.getFormDefaults(), ...criteria });
    form.reset(
      {
        ...criteriaRawValue,
        id: { value: criteriaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CriteriaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertCriteriaRawValueToCriteria(rawCriteria: CriteriaFormRawValue | NewCriteriaFormRawValue): ICriteria | NewCriteria {
    return {
      ...rawCriteria,
      createdAt: dayjs(rawCriteria.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawCriteria.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertCriteriaToCriteriaRawValue(
    criteria: ICriteria | (Partial<NewCriteria> & CriteriaFormDefaults),
  ): CriteriaFormRawValue | PartialWithRequiredKeyOf<NewCriteriaFormRawValue> {
    return {
      ...criteria,
      createdAt: criteria.createdAt ? criteria.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: criteria.updatedAt ? criteria.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
