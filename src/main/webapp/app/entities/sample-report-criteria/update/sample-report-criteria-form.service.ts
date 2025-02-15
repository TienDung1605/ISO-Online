import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISampleReportCriteria, NewSampleReportCriteria } from '../sample-report-criteria.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISampleReportCriteria for edit and NewSampleReportCriteriaFormGroupInput for create.
 */
type SampleReportCriteriaFormGroupInput = ISampleReportCriteria | PartialWithRequiredKeyOf<NewSampleReportCriteria>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISampleReportCriteria | NewSampleReportCriteria> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type SampleReportCriteriaFormRawValue = FormValueOf<ISampleReportCriteria>;

type NewSampleReportCriteriaFormRawValue = FormValueOf<NewSampleReportCriteria>;

type SampleReportCriteriaFormDefaults = Pick<NewSampleReportCriteria, 'id' | 'createdAt' | 'updatedAt'>;

type SampleReportCriteriaFormGroupContent = {
  id: FormControl<SampleReportCriteriaFormRawValue['id'] | NewSampleReportCriteria['id']>;
  criteriaName: FormControl<SampleReportCriteriaFormRawValue['criteriaName']>;
  criteriaGroupName: FormControl<SampleReportCriteriaFormRawValue['criteriaGroupName']>;
  criteriaId: FormControl<SampleReportCriteriaFormRawValue['criteriaId']>;
  criteriaGroupId: FormControl<SampleReportCriteriaFormRawValue['criteriaGroupId']>;
  status: FormControl<SampleReportCriteriaFormRawValue['status']>;
  createdAt: FormControl<SampleReportCriteriaFormRawValue['createdAt']>;
  updatedAt: FormControl<SampleReportCriteriaFormRawValue['updatedAt']>;
  updateBy: FormControl<SampleReportCriteriaFormRawValue['updateBy']>;
  frequency: FormControl<SampleReportCriteriaFormRawValue['frequency']>;
  sampleReportId: FormControl<SampleReportCriteriaFormRawValue['sampleReportId']>;
  detail: FormControl<SampleReportCriteriaFormRawValue['detail']>;
};

export type SampleReportCriteriaFormGroup = FormGroup<SampleReportCriteriaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SampleReportCriteriaFormService {
  createSampleReportCriteriaFormGroup(
    sampleReportCriteria: SampleReportCriteriaFormGroupInput = { id: null },
  ): SampleReportCriteriaFormGroup {
    const sampleReportCriteriaRawValue = this.convertSampleReportCriteriaToSampleReportCriteriaRawValue({
      ...this.getFormDefaults(),
      ...sampleReportCriteria,
    });
    return new FormGroup<SampleReportCriteriaFormGroupContent>({
      id: new FormControl(
        { value: sampleReportCriteriaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      criteriaName: new FormControl(sampleReportCriteriaRawValue.criteriaName),
      criteriaGroupName: new FormControl(sampleReportCriteriaRawValue.criteriaGroupName),
      criteriaId: new FormControl(sampleReportCriteriaRawValue.criteriaId),
      criteriaGroupId: new FormControl(sampleReportCriteriaRawValue.criteriaGroupId),
      status: new FormControl(sampleReportCriteriaRawValue.status),
      createdAt: new FormControl(sampleReportCriteriaRawValue.createdAt),
      updatedAt: new FormControl(sampleReportCriteriaRawValue.updatedAt),
      updateBy: new FormControl(sampleReportCriteriaRawValue.updateBy),
      frequency: new FormControl(sampleReportCriteriaRawValue.frequency),
      sampleReportId: new FormControl(sampleReportCriteriaRawValue.sampleReportId),
      detail: new FormControl(sampleReportCriteriaRawValue.detail),
    });
  }

  getSampleReportCriteria(form: SampleReportCriteriaFormGroup): ISampleReportCriteria | NewSampleReportCriteria {
    return this.convertSampleReportCriteriaRawValueToSampleReportCriteria(
      form.getRawValue() as SampleReportCriteriaFormRawValue | NewSampleReportCriteriaFormRawValue,
    );
  }

  resetForm(form: SampleReportCriteriaFormGroup, sampleReportCriteria: SampleReportCriteriaFormGroupInput): void {
    const sampleReportCriteriaRawValue = this.convertSampleReportCriteriaToSampleReportCriteriaRawValue({
      ...this.getFormDefaults(),
      ...sampleReportCriteria,
    });
    form.reset(
      {
        ...sampleReportCriteriaRawValue,
        id: { value: sampleReportCriteriaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SampleReportCriteriaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertSampleReportCriteriaRawValueToSampleReportCriteria(
    rawSampleReportCriteria: SampleReportCriteriaFormRawValue | NewSampleReportCriteriaFormRawValue,
  ): ISampleReportCriteria | NewSampleReportCriteria {
    return {
      ...rawSampleReportCriteria,
      createdAt: dayjs(rawSampleReportCriteria.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawSampleReportCriteria.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertSampleReportCriteriaToSampleReportCriteriaRawValue(
    sampleReportCriteria: ISampleReportCriteria | (Partial<NewSampleReportCriteria> & SampleReportCriteriaFormDefaults),
  ): SampleReportCriteriaFormRawValue | PartialWithRequiredKeyOf<NewSampleReportCriteriaFormRawValue> {
    return {
      ...sampleReportCriteria,
      createdAt: sampleReportCriteria.createdAt ? sampleReportCriteria.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: sampleReportCriteria.updatedAt ? sampleReportCriteria.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
