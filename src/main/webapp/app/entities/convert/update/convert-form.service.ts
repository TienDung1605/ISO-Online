import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IConvert, NewConvert } from '../convert.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConvert for edit and NewConvertFormGroupInput for create.
 */
type ConvertFormGroupInput = IConvert | PartialWithRequiredKeyOf<NewConvert>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IConvert | NewConvert> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ConvertFormRawValue = FormValueOf<IConvert>;

type NewConvertFormRawValue = FormValueOf<NewConvert>;

type ConvertFormDefaults = Pick<NewConvert, 'id' | 'createdAt' | 'updatedAt'>;

type ConvertFormGroupContent = {
  id: FormControl<ConvertFormRawValue['id'] | NewConvert['id']>;
  name: FormControl<ConvertFormRawValue['name']>;
  type: FormControl<ConvertFormRawValue['type']>;
  mark: FormControl<ConvertFormRawValue['mark']>;
  createdAt: FormControl<ConvertFormRawValue['createdAt']>;
  updatedAt: FormControl<ConvertFormRawValue['updatedAt']>;
  updateBy: FormControl<ConvertFormRawValue['updateBy']>;
  score: FormControl<ConvertFormRawValue['score']>;
  count: FormControl<ConvertFormRawValue['count']>;
};

export type ConvertFormGroup = FormGroup<ConvertFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConvertFormService {
  createConvertFormGroup(convert: ConvertFormGroupInput = { id: null }): ConvertFormGroup {
    const convertRawValue = this.convertConvertToConvertRawValue({
      ...this.getFormDefaults(),
      ...convert,
    });
    return new FormGroup<ConvertFormGroupContent>({
      id: new FormControl(
        { value: convertRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(convertRawValue.name),
      type: new FormControl(convertRawValue.type),
      mark: new FormControl(convertRawValue.mark),
      createdAt: new FormControl(convertRawValue.createdAt),
      updatedAt: new FormControl(convertRawValue.updatedAt),
      updateBy: new FormControl(convertRawValue.updateBy),
      score: new FormControl(convertRawValue.score),
      count: new FormControl(convertRawValue.count),
    });
  }

  getConvert(form: ConvertFormGroup): IConvert | NewConvert {
    return this.convertConvertRawValueToConvert(form.getRawValue() as ConvertFormRawValue | NewConvertFormRawValue);
  }

  resetForm(form: ConvertFormGroup, convert: ConvertFormGroupInput): void {
    const convertRawValue = this.convertConvertToConvertRawValue({ ...this.getFormDefaults(), ...convert });
    form.reset(
      {
        ...convertRawValue,
        id: { value: convertRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ConvertFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertConvertRawValueToConvert(rawConvert: ConvertFormRawValue | NewConvertFormRawValue): IConvert | NewConvert {
    return {
      ...rawConvert,
      createdAt: dayjs(rawConvert.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawConvert.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertConvertToConvertRawValue(
    convert: IConvert | (Partial<NewConvert> & ConvertFormDefaults),
  ): ConvertFormRawValue | PartialWithRequiredKeyOf<NewConvertFormRawValue> {
    return {
      ...convert,
      createdAt: convert.createdAt ? convert.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: convert.updatedAt ? convert.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
