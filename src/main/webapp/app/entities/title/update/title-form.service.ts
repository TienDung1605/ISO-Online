import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITitle, NewTitle } from '../title.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITitle for edit and NewTitleFormGroupInput for create.
 */
type TitleFormGroupInput = ITitle | PartialWithRequiredKeyOf<NewTitle>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITitle | NewTitle> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type TitleFormRawValue = FormValueOf<ITitle>;

type NewTitleFormRawValue = FormValueOf<NewTitle>;

type TitleFormDefaults = Pick<NewTitle, 'id' | 'createdAt' | 'updatedAt'>;

type TitleFormGroupContent = {
  id: FormControl<TitleFormRawValue['id'] | NewTitle['id']>;
  name: FormControl<TitleFormRawValue['name']>;
  source: FormControl<TitleFormRawValue['source']>;
  createdAt: FormControl<TitleFormRawValue['createdAt']>;
  updatedAt: FormControl<TitleFormRawValue['updatedAt']>;
  dataType: FormControl<TitleFormRawValue['dataType']>;
  updateBy: FormControl<TitleFormRawValue['updateBy']>;
  field: FormControl<TitleFormRawValue['field']>;
};

export type TitleFormGroup = FormGroup<TitleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TitleFormService {
  createTitleFormGroup(title: TitleFormGroupInput = { id: null }): TitleFormGroup {
    const titleRawValue = this.convertTitleToTitleRawValue({
      ...this.getFormDefaults(),
      ...title,
    });
    return new FormGroup<TitleFormGroupContent>({
      id: new FormControl(
        { value: titleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(titleRawValue.name),
      source: new FormControl(titleRawValue.source),
      createdAt: new FormControl(titleRawValue.createdAt),
      updatedAt: new FormControl(titleRawValue.updatedAt),
      dataType: new FormControl(titleRawValue.dataType),
      updateBy: new FormControl(titleRawValue.updateBy),
      field: new FormControl(titleRawValue.field),
    });
  }

  getTitle(form: TitleFormGroup): ITitle | NewTitle {
    return this.convertTitleRawValueToTitle(form.getRawValue() as TitleFormRawValue | NewTitleFormRawValue);
  }

  resetForm(form: TitleFormGroup, title: TitleFormGroupInput): void {
    const titleRawValue = this.convertTitleToTitleRawValue({ ...this.getFormDefaults(), ...title });
    form.reset(
      {
        ...titleRawValue,
        id: { value: titleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TitleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertTitleRawValueToTitle(rawTitle: TitleFormRawValue | NewTitleFormRawValue): ITitle | NewTitle {
    return {
      ...rawTitle,
      createdAt: dayjs(rawTitle.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawTitle.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertTitleToTitleRawValue(
    title: ITitle | (Partial<NewTitle> & TitleFormDefaults),
  ): TitleFormRawValue | PartialWithRequiredKeyOf<NewTitleFormRawValue> {
    return {
      ...title,
      createdAt: title.createdAt ? title.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: title.updatedAt ? title.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
