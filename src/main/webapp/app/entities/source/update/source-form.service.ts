import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISource, NewSource } from '../source.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISource for edit and NewSourceFormGroupInput for create.
 */
type SourceFormGroupInput = ISource | PartialWithRequiredKeyOf<NewSource>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISource | NewSource> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type SourceFormRawValue = FormValueOf<ISource>;

type NewSourceFormRawValue = FormValueOf<NewSource>;

type SourceFormDefaults = Pick<NewSource, 'id' | 'createdAt' | 'updatedAt'>;

type SourceFormGroupContent = {
  id: FormControl<SourceFormRawValue['id'] | NewSource['id']>;
  name: FormControl<SourceFormRawValue['name']>;
  source: FormControl<SourceFormRawValue['source']>;
  createdAt: FormControl<SourceFormRawValue['createdAt']>;
  updatedAt: FormControl<SourceFormRawValue['updatedAt']>;
  createBy: FormControl<SourceFormRawValue['createBy']>;
};

export type SourceFormGroup = FormGroup<SourceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SourceFormService {
  createSourceFormGroup(source: SourceFormGroupInput = { id: null }): SourceFormGroup {
    const sourceRawValue = this.convertSourceToSourceRawValue({
      ...this.getFormDefaults(),
      ...source,
    });
    return new FormGroup<SourceFormGroupContent>({
      id: new FormControl(
        { value: sourceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(sourceRawValue.name),
      source: new FormControl(sourceRawValue.source),
      createdAt: new FormControl(sourceRawValue.createdAt),
      updatedAt: new FormControl(sourceRawValue.updatedAt),
      createBy: new FormControl(sourceRawValue.createBy),
    });
  }

  getSource(form: SourceFormGroup): ISource | NewSource {
    return this.convertSourceRawValueToSource(form.getRawValue() as SourceFormRawValue | NewSourceFormRawValue);
  }

  resetForm(form: SourceFormGroup, source: SourceFormGroupInput): void {
    const sourceRawValue = this.convertSourceToSourceRawValue({ ...this.getFormDefaults(), ...source });
    form.reset(
      {
        ...sourceRawValue,
        id: { value: sourceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SourceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertSourceRawValueToSource(rawSource: SourceFormRawValue | NewSourceFormRawValue): ISource | NewSource {
    return {
      ...rawSource,
      createdAt: dayjs(rawSource.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawSource.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertSourceToSourceRawValue(
    source: ISource | (Partial<NewSource> & SourceFormDefaults),
  ): SourceFormRawValue | PartialWithRequiredKeyOf<NewSourceFormRawValue> {
    return {
      ...source,
      createdAt: source.createdAt ? source.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: source.updatedAt ? source.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
