import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IParts, NewParts } from '../parts.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IParts for edit and NewPartsFormGroupInput for create.
 */
type PartsFormGroupInput = IParts | PartialWithRequiredKeyOf<NewParts>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IParts | NewParts> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type PartsFormRawValue = FormValueOf<IParts>;

type NewPartsFormRawValue = FormValueOf<NewParts>;

type PartsFormDefaults = Pick<NewParts, 'id' | 'createdAt' | 'updatedAt'>;

type PartsFormGroupContent = {
  id: FormControl<PartsFormRawValue['id'] | NewParts['id']>;
  name: FormControl<PartsFormRawValue['name']>;
  status: FormControl<PartsFormRawValue['status']>;
  createdAt: FormControl<PartsFormRawValue['createdAt']>;
  updatedAt: FormControl<PartsFormRawValue['updatedAt']>;
  updateBy: FormControl<PartsFormRawValue['updateBy']>;
};

export type PartsFormGroup = FormGroup<PartsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PartsFormService {
  createPartsFormGroup(parts: PartsFormGroupInput = { id: null }): PartsFormGroup {
    const partsRawValue = this.convertPartsToPartsRawValue({
      ...this.getFormDefaults(),
      ...parts,
    });
    return new FormGroup<PartsFormGroupContent>({
      id: new FormControl(
        { value: partsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(partsRawValue.name),
      status: new FormControl(partsRawValue.status),
      createdAt: new FormControl(partsRawValue.createdAt),
      updatedAt: new FormControl(partsRawValue.updatedAt),
      updateBy: new FormControl(partsRawValue.updateBy),
    });
  }

  getParts(form: PartsFormGroup): IParts | NewParts {
    return this.convertPartsRawValueToParts(form.getRawValue() as PartsFormRawValue | NewPartsFormRawValue);
  }

  resetForm(form: PartsFormGroup, parts: PartsFormGroupInput): void {
    const partsRawValue = this.convertPartsToPartsRawValue({ ...this.getFormDefaults(), ...parts });
    form.reset(
      {
        ...partsRawValue,
        id: { value: partsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PartsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertPartsRawValueToParts(rawParts: PartsFormRawValue | NewPartsFormRawValue): IParts | NewParts {
    return {
      ...rawParts,
      createdAt: dayjs(rawParts.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawParts.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertPartsToPartsRawValue(
    parts: IParts | (Partial<NewParts> & PartsFormDefaults),
  ): PartsFormRawValue | PartialWithRequiredKeyOf<NewPartsFormRawValue> {
    return {
      ...parts,
      createdAt: parts.createdAt ? parts.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: parts.updatedAt ? parts.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
