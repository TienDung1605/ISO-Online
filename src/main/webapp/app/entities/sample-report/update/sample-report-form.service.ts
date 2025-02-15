import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISampleReport, NewSampleReport } from '../sample-report.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISampleReport for edit and NewSampleReportFormGroupInput for create.
 */
type SampleReportFormGroupInput = ISampleReport | PartialWithRequiredKeyOf<NewSampleReport>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISampleReport | NewSampleReport> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type SampleReportFormRawValue = FormValueOf<ISampleReport>;

type NewSampleReportFormRawValue = FormValueOf<NewSampleReport>;

type SampleReportFormDefaults = Pick<NewSampleReport, 'id' | 'createdAt' | 'updatedAt'>;

type SampleReportFormGroupContent = {
  id: FormControl<SampleReportFormRawValue['id'] | NewSampleReport['id']>;
  name: FormControl<SampleReportFormRawValue['name']>;
  status: FormControl<SampleReportFormRawValue['status']>;
  createdAt: FormControl<SampleReportFormRawValue['createdAt']>;
  updatedAt: FormControl<SampleReportFormRawValue['updatedAt']>;
  updateBy: FormControl<SampleReportFormRawValue['updateBy']>;
  frequency: FormControl<SampleReportFormRawValue['frequency']>;
  code: FormControl<SampleReportFormRawValue['code']>;
  reportType: FormControl<SampleReportFormRawValue['reportType']>;
  reportTypeId: FormControl<SampleReportFormRawValue['reportTypeId']>;
};

export type SampleReportFormGroup = FormGroup<SampleReportFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SampleReportFormService {
  createSampleReportFormGroup(sampleReport: SampleReportFormGroupInput = { id: null }): SampleReportFormGroup {
    const sampleReportRawValue = this.convertSampleReportToSampleReportRawValue({
      ...this.getFormDefaults(),
      ...sampleReport,
    });
    return new FormGroup<SampleReportFormGroupContent>({
      id: new FormControl(
        { value: sampleReportRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(sampleReportRawValue.name),
      status: new FormControl(sampleReportRawValue.status),
      createdAt: new FormControl(sampleReportRawValue.createdAt),
      updatedAt: new FormControl(sampleReportRawValue.updatedAt),
      updateBy: new FormControl(sampleReportRawValue.updateBy),
      frequency: new FormControl(sampleReportRawValue.frequency),
      code: new FormControl(sampleReportRawValue.code),
      reportType: new FormControl(sampleReportRawValue.reportType),
      reportTypeId: new FormControl(sampleReportRawValue.reportTypeId),
    });
  }

  getSampleReport(form: SampleReportFormGroup): ISampleReport | NewSampleReport {
    return this.convertSampleReportRawValueToSampleReport(form.getRawValue() as SampleReportFormRawValue | NewSampleReportFormRawValue);
  }

  resetForm(form: SampleReportFormGroup, sampleReport: SampleReportFormGroupInput): void {
    const sampleReportRawValue = this.convertSampleReportToSampleReportRawValue({ ...this.getFormDefaults(), ...sampleReport });
    form.reset(
      {
        ...sampleReportRawValue,
        id: { value: sampleReportRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SampleReportFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertSampleReportRawValueToSampleReport(
    rawSampleReport: SampleReportFormRawValue | NewSampleReportFormRawValue,
  ): ISampleReport | NewSampleReport {
    return {
      ...rawSampleReport,
      createdAt: dayjs(rawSampleReport.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawSampleReport.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertSampleReportToSampleReportRawValue(
    sampleReport: ISampleReport | (Partial<NewSampleReport> & SampleReportFormDefaults),
  ): SampleReportFormRawValue | PartialWithRequiredKeyOf<NewSampleReportFormRawValue> {
    return {
      ...sampleReport,
      createdAt: sampleReport.createdAt ? sampleReport.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: sampleReport.updatedAt ? sampleReport.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
