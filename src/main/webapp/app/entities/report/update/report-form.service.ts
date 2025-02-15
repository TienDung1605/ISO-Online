import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReport, NewReport } from '../report.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReport for edit and NewReportFormGroupInput for create.
 */
type ReportFormGroupInput = IReport | PartialWithRequiredKeyOf<NewReport>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReport | NewReport> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ReportFormRawValue = FormValueOf<IReport>;

type NewReportFormRawValue = FormValueOf<NewReport>;

type ReportFormDefaults = Pick<NewReport, 'id' | 'createdAt' | 'updatedAt'>;

type ReportFormGroupContent = {
  id: FormControl<ReportFormRawValue['id'] | NewReport['id']>;
  name: FormControl<ReportFormRawValue['name']>;
  code: FormControl<ReportFormRawValue['code']>;
  sampleReportId: FormControl<ReportFormRawValue['sampleReportId']>;
  testOfObject: FormControl<ReportFormRawValue['testOfObject']>;
  checker: FormControl<ReportFormRawValue['checker']>;
  status: FormControl<ReportFormRawValue['status']>;
  frequency: FormControl<ReportFormRawValue['frequency']>;
  reportType: FormControl<ReportFormRawValue['reportType']>;
  reportTypeId: FormControl<ReportFormRawValue['reportTypeId']>;
  createdAt: FormControl<ReportFormRawValue['createdAt']>;
  updatedAt: FormControl<ReportFormRawValue['updatedAt']>;
  scoreScale: FormControl<ReportFormRawValue['scoreScale']>;
  updateBy: FormControl<ReportFormRawValue['updateBy']>;
  planId: FormControl<ReportFormRawValue['planId']>;
  user: FormControl<ReportFormRawValue['user']>;
};

export type ReportFormGroup = FormGroup<ReportFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReportFormService {
  createReportFormGroup(report: ReportFormGroupInput = { id: null }): ReportFormGroup {
    const reportRawValue = this.convertReportToReportRawValue({
      ...this.getFormDefaults(),
      ...report,
    });
    return new FormGroup<ReportFormGroupContent>({
      id: new FormControl(
        { value: reportRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(reportRawValue.name),
      code: new FormControl(reportRawValue.code),
      sampleReportId: new FormControl(reportRawValue.sampleReportId),
      testOfObject: new FormControl(reportRawValue.testOfObject),
      checker: new FormControl(reportRawValue.checker),
      status: new FormControl(reportRawValue.status),
      frequency: new FormControl(reportRawValue.frequency),
      reportType: new FormControl(reportRawValue.reportType),
      reportTypeId: new FormControl(reportRawValue.reportTypeId),
      createdAt: new FormControl(reportRawValue.createdAt),
      updatedAt: new FormControl(reportRawValue.updatedAt),
      scoreScale: new FormControl(reportRawValue.scoreScale),
      updateBy: new FormControl(reportRawValue.updateBy),
      planId: new FormControl(reportRawValue.planId),
      user: new FormControl(reportRawValue.user),
    });
  }

  getReport(form: ReportFormGroup): IReport | NewReport {
    return this.convertReportRawValueToReport(form.getRawValue() as ReportFormRawValue | NewReportFormRawValue);
  }

  resetForm(form: ReportFormGroup, report: ReportFormGroupInput): void {
    const reportRawValue = this.convertReportToReportRawValue({ ...this.getFormDefaults(), ...report });
    form.reset(
      {
        ...reportRawValue,
        id: { value: reportRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReportFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertReportRawValueToReport(rawReport: ReportFormRawValue | NewReportFormRawValue): IReport | NewReport {
    return {
      ...rawReport,
      createdAt: dayjs(rawReport.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawReport.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertReportToReportRawValue(
    report: IReport | (Partial<NewReport> & ReportFormDefaults),
  ): ReportFormRawValue | PartialWithRequiredKeyOf<NewReportFormRawValue> {
    return {
      ...report,
      createdAt: report.createdAt ? report.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: report.updatedAt ? report.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
