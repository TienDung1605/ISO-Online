import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReportType, NewReportType } from '../report-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReportType for edit and NewReportTypeFormGroupInput for create.
 */
type ReportTypeFormGroupInput = IReportType | PartialWithRequiredKeyOf<NewReportType>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReportType | NewReportType> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ReportTypeFormRawValue = FormValueOf<IReportType>;

type NewReportTypeFormRawValue = FormValueOf<NewReportType>;

type ReportTypeFormDefaults = Pick<NewReportType, 'id' | 'createdAt' | 'updatedAt'>;

type ReportTypeFormGroupContent = {
  id: FormControl<ReportTypeFormRawValue['id'] | NewReportType['id']>;
  code: FormControl<ReportTypeFormRawValue['code']>;
  name: FormControl<ReportTypeFormRawValue['name']>;
  status: FormControl<ReportTypeFormRawValue['status']>;
  createdAt: FormControl<ReportTypeFormRawValue['createdAt']>;
  updatedAt: FormControl<ReportTypeFormRawValue['updatedAt']>;
  updateBy: FormControl<ReportTypeFormRawValue['updateBy']>;
};

export type ReportTypeFormGroup = FormGroup<ReportTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReportTypeFormService {
  createReportTypeFormGroup(reportType: ReportTypeFormGroupInput = { id: null }): ReportTypeFormGroup {
    const reportTypeRawValue = this.convertReportTypeToReportTypeRawValue({
      ...this.getFormDefaults(),
      ...reportType,
    });
    return new FormGroup<ReportTypeFormGroupContent>({
      id: new FormControl(
        { value: reportTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(reportTypeRawValue.code),
      name: new FormControl(reportTypeRawValue.name),
      status: new FormControl(reportTypeRawValue.status),
      createdAt: new FormControl(reportTypeRawValue.createdAt),
      updatedAt: new FormControl(reportTypeRawValue.updatedAt),
      updateBy: new FormControl(reportTypeRawValue.updateBy),
    });
  }

  getReportType(form: ReportTypeFormGroup): IReportType | NewReportType {
    return this.convertReportTypeRawValueToReportType(form.getRawValue() as ReportTypeFormRawValue | NewReportTypeFormRawValue);
  }

  resetForm(form: ReportTypeFormGroup, reportType: ReportTypeFormGroupInput): void {
    const reportTypeRawValue = this.convertReportTypeToReportTypeRawValue({ ...this.getFormDefaults(), ...reportType });
    form.reset(
      {
        ...reportTypeRawValue,
        id: { value: reportTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReportTypeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertReportTypeRawValueToReportType(
    rawReportType: ReportTypeFormRawValue | NewReportTypeFormRawValue,
  ): IReportType | NewReportType {
    return {
      ...rawReportType,
      createdAt: dayjs(rawReportType.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawReportType.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertReportTypeToReportTypeRawValue(
    reportType: IReportType | (Partial<NewReportType> & ReportTypeFormDefaults),
  ): ReportTypeFormRawValue | PartialWithRequiredKeyOf<NewReportTypeFormRawValue> {
    return {
      ...reportType,
      createdAt: reportType.createdAt ? reportType.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: reportType.updatedAt ? reportType.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
