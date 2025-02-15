import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFrequency, NewFrequency } from '../frequency.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFrequency for edit and NewFrequencyFormGroupInput for create.
 */
type FrequencyFormGroupInput = IFrequency | PartialWithRequiredKeyOf<NewFrequency>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFrequency | NewFrequency> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type FrequencyFormRawValue = FormValueOf<IFrequency>;

type NewFrequencyFormRawValue = FormValueOf<NewFrequency>;

type FrequencyFormDefaults = Pick<NewFrequency, 'id' | 'createdAt' | 'updatedAt'>;

type FrequencyFormGroupContent = {
  id: FormControl<FrequencyFormRawValue['id'] | NewFrequency['id']>;
  name: FormControl<FrequencyFormRawValue['name']>;
  createdAt: FormControl<FrequencyFormRawValue['createdAt']>;
  updatedAt: FormControl<FrequencyFormRawValue['updatedAt']>;
  status: FormControl<FrequencyFormRawValue['status']>;
  updateBy: FormControl<FrequencyFormRawValue['updateBy']>;
};

export type FrequencyFormGroup = FormGroup<FrequencyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FrequencyFormService {
  createFrequencyFormGroup(frequency: FrequencyFormGroupInput = { id: null }): FrequencyFormGroup {
    const frequencyRawValue = this.convertFrequencyToFrequencyRawValue({
      ...this.getFormDefaults(),
      ...frequency,
    });
    return new FormGroup<FrequencyFormGroupContent>({
      id: new FormControl(
        { value: frequencyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(frequencyRawValue.name),
      createdAt: new FormControl(frequencyRawValue.createdAt),
      updatedAt: new FormControl(frequencyRawValue.updatedAt),
      status: new FormControl(frequencyRawValue.status),
      updateBy: new FormControl(frequencyRawValue.updateBy),
    });
  }

  getFrequency(form: FrequencyFormGroup): IFrequency | NewFrequency {
    return this.convertFrequencyRawValueToFrequency(form.getRawValue() as FrequencyFormRawValue | NewFrequencyFormRawValue);
  }

  resetForm(form: FrequencyFormGroup, frequency: FrequencyFormGroupInput): void {
    const frequencyRawValue = this.convertFrequencyToFrequencyRawValue({ ...this.getFormDefaults(), ...frequency });
    form.reset(
      {
        ...frequencyRawValue,
        id: { value: frequencyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FrequencyFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertFrequencyRawValueToFrequency(rawFrequency: FrequencyFormRawValue | NewFrequencyFormRawValue): IFrequency | NewFrequency {
    return {
      ...rawFrequency,
      createdAt: dayjs(rawFrequency.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawFrequency.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertFrequencyToFrequencyRawValue(
    frequency: IFrequency | (Partial<NewFrequency> & FrequencyFormDefaults),
  ): FrequencyFormRawValue | PartialWithRequiredKeyOf<NewFrequencyFormRawValue> {
    return {
      ...frequency,
      createdAt: frequency.createdAt ? frequency.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: frequency.updatedAt ? frequency.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
