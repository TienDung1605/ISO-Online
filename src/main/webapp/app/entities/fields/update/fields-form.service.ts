import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFields, NewFields } from '../fields.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFields for edit and NewFieldsFormGroupInput for create.
 */
type FieldsFormGroupInput = IFields | PartialWithRequiredKeyOf<NewFields>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFields | NewFields> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type FieldsFormRawValue = FormValueOf<IFields>;

type NewFieldsFormRawValue = FormValueOf<NewFields>;

type FieldsFormDefaults = Pick<NewFields, 'id' | 'createdAt' | 'updatedAt'>;

type FieldsFormGroupContent = {
  id: FormControl<FieldsFormRawValue['id'] | NewFields['id']>;
  name: FormControl<FieldsFormRawValue['name']>;
  fieldName: FormControl<FieldsFormRawValue['fieldName']>;
  sourceId: FormControl<FieldsFormRawValue['sourceId']>;
  createdAt: FormControl<FieldsFormRawValue['createdAt']>;
  updatedAt: FormControl<FieldsFormRawValue['updatedAt']>;
  createBy: FormControl<FieldsFormRawValue['createBy']>;
  source: FormControl<FieldsFormRawValue['source']>;
};

export type FieldsFormGroup = FormGroup<FieldsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FieldsFormService {
  createFieldsFormGroup(fields: FieldsFormGroupInput = { id: null }): FieldsFormGroup {
    const fieldsRawValue = this.convertFieldsToFieldsRawValue({
      ...this.getFormDefaults(),
      ...fields,
    });
    return new FormGroup<FieldsFormGroupContent>({
      id: new FormControl(
        { value: fieldsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(fieldsRawValue.name),
      fieldName: new FormControl(fieldsRawValue.fieldName),
      sourceId: new FormControl(fieldsRawValue.sourceId),
      createdAt: new FormControl(fieldsRawValue.createdAt),
      updatedAt: new FormControl(fieldsRawValue.updatedAt),
      createBy: new FormControl(fieldsRawValue.createBy),
      source: new FormControl(fieldsRawValue.source),
    });
  }

  getFields(form: FieldsFormGroup): IFields | NewFields {
    return this.convertFieldsRawValueToFields(form.getRawValue() as FieldsFormRawValue | NewFieldsFormRawValue);
  }

  resetForm(form: FieldsFormGroup, fields: FieldsFormGroupInput): void {
    const fieldsRawValue = this.convertFieldsToFieldsRawValue({ ...this.getFormDefaults(), ...fields });
    form.reset(
      {
        ...fieldsRawValue,
        id: { value: fieldsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FieldsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertFieldsRawValueToFields(rawFields: FieldsFormRawValue | NewFieldsFormRawValue): IFields | NewFields {
    return {
      ...rawFields,
      createdAt: dayjs(rawFields.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawFields.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertFieldsToFieldsRawValue(
    fields: IFields | (Partial<NewFields> & FieldsFormDefaults),
  ): FieldsFormRawValue | PartialWithRequiredKeyOf<NewFieldsFormRawValue> {
    return {
      ...fields,
      createdAt: fields.createdAt ? fields.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: fields.updatedAt ? fields.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
