import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReportTitle, NewReportTitle } from '../report-title.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReportTitle for edit and NewReportTitleFormGroupInput for create.
 */
type ReportTitleFormGroupInput = IReportTitle | PartialWithRequiredKeyOf<NewReportTitle>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReportTitle | NewReportTitle> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ReportTitleFormRawValue = FormValueOf<IReportTitle>;

type NewReportTitleFormRawValue = FormValueOf<NewReportTitle>;

type ReportTitleFormDefaults = Pick<NewReportTitle, 'id' | 'createdAt' | 'updatedAt'>;

type ReportTitleFormGroupContent = {
  id: FormControl<ReportTitleFormRawValue['id'] | NewReportTitle['id']>;
  name: FormControl<ReportTitleFormRawValue['name']>;
  source: FormControl<ReportTitleFormRawValue['source']>;
  field: FormControl<ReportTitleFormRawValue['field']>;
  dataType: FormControl<ReportTitleFormRawValue['dataType']>;
  index: FormControl<ReportTitleFormRawValue['index']>;
  createdAt: FormControl<ReportTitleFormRawValue['createdAt']>;
  updatedAt: FormControl<ReportTitleFormRawValue['updatedAt']>;
  updateBy: FormControl<ReportTitleFormRawValue['updateBy']>;
  reportId: FormControl<ReportTitleFormRawValue['reportId']>;
};

export type ReportTitleFormGroup = FormGroup<ReportTitleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReportTitleFormService {
  createReportTitleFormGroup(reportTitle: ReportTitleFormGroupInput = { id: null }): ReportTitleFormGroup {
    const reportTitleRawValue = this.convertReportTitleToReportTitleRawValue({
      ...this.getFormDefaults(),
      ...reportTitle,
    });
    return new FormGroup<ReportTitleFormGroupContent>({
      id: new FormControl(
        { value: reportTitleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(reportTitleRawValue.name),
      source: new FormControl(reportTitleRawValue.source),
      field: new FormControl(reportTitleRawValue.field),
      dataType: new FormControl(reportTitleRawValue.dataType),
      index: new FormControl(reportTitleRawValue.index),
      createdAt: new FormControl(reportTitleRawValue.createdAt),
      updatedAt: new FormControl(reportTitleRawValue.updatedAt),
      updateBy: new FormControl(reportTitleRawValue.updateBy),
      reportId: new FormControl(reportTitleRawValue.reportId),
    });
  }

  getReportTitle(form: ReportTitleFormGroup): IReportTitle | NewReportTitle {
    return this.convertReportTitleRawValueToReportTitle(form.getRawValue() as ReportTitleFormRawValue | NewReportTitleFormRawValue);
  }

  resetForm(form: ReportTitleFormGroup, reportTitle: ReportTitleFormGroupInput): void {
    const reportTitleRawValue = this.convertReportTitleToReportTitleRawValue({ ...this.getFormDefaults(), ...reportTitle });
    form.reset(
      {
        ...reportTitleRawValue,
        id: { value: reportTitleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReportTitleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertReportTitleRawValueToReportTitle(
    rawReportTitle: ReportTitleFormRawValue | NewReportTitleFormRawValue,
  ): IReportTitle | NewReportTitle {
    return {
      ...rawReportTitle,
      createdAt: dayjs(rawReportTitle.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawReportTitle.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertReportTitleToReportTitleRawValue(
    reportTitle: IReportTitle | (Partial<NewReportTitle> & ReportTitleFormDefaults),
  ): ReportTitleFormRawValue | PartialWithRequiredKeyOf<NewReportTitleFormRawValue> {
    return {
      ...reportTitle,
      createdAt: reportTitle.createdAt ? reportTitle.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: reportTitle.updatedAt ? reportTitle.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
