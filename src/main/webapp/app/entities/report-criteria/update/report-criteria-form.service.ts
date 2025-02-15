import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReportCriteria, NewReportCriteria } from '../report-criteria.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReportCriteria for edit and NewReportCriteriaFormGroupInput for create.
 */
type ReportCriteriaFormGroupInput = IReportCriteria | PartialWithRequiredKeyOf<NewReportCriteria>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReportCriteria | NewReportCriteria> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ReportCriteriaFormRawValue = FormValueOf<IReportCriteria>;

type NewReportCriteriaFormRawValue = FormValueOf<NewReportCriteria>;

type ReportCriteriaFormDefaults = Pick<NewReportCriteria, 'id' | 'createdAt' | 'updatedAt'>;

type ReportCriteriaFormGroupContent = {
  id: FormControl<ReportCriteriaFormRawValue['id'] | NewReportCriteria['id']>;
  criteriaName: FormControl<ReportCriteriaFormRawValue['criteriaName']>;
  criteriaGroupName: FormControl<ReportCriteriaFormRawValue['criteriaGroupName']>;
  criteriaId: FormControl<ReportCriteriaFormRawValue['criteriaId']>;
  criteriaGroupId: FormControl<ReportCriteriaFormRawValue['criteriaGroupId']>;
  status: FormControl<ReportCriteriaFormRawValue['status']>;
  createdAt: FormControl<ReportCriteriaFormRawValue['createdAt']>;
  updatedAt: FormControl<ReportCriteriaFormRawValue['updatedAt']>;
  updateBy: FormControl<ReportCriteriaFormRawValue['updateBy']>;
  frequency: FormControl<ReportCriteriaFormRawValue['frequency']>;
  reportId: FormControl<ReportCriteriaFormRawValue['reportId']>;
};

export type ReportCriteriaFormGroup = FormGroup<ReportCriteriaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReportCriteriaFormService {
  createReportCriteriaFormGroup(reportCriteria: ReportCriteriaFormGroupInput = { id: null }): ReportCriteriaFormGroup {
    const reportCriteriaRawValue = this.convertReportCriteriaToReportCriteriaRawValue({
      ...this.getFormDefaults(),
      ...reportCriteria,
    });
    return new FormGroup<ReportCriteriaFormGroupContent>({
      id: new FormControl(
        { value: reportCriteriaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      criteriaName: new FormControl(reportCriteriaRawValue.criteriaName),
      criteriaGroupName: new FormControl(reportCriteriaRawValue.criteriaGroupName),
      criteriaId: new FormControl(reportCriteriaRawValue.criteriaId),
      criteriaGroupId: new FormControl(reportCriteriaRawValue.criteriaGroupId),
      status: new FormControl(reportCriteriaRawValue.status),
      createdAt: new FormControl(reportCriteriaRawValue.createdAt),
      updatedAt: new FormControl(reportCriteriaRawValue.updatedAt),
      updateBy: new FormControl(reportCriteriaRawValue.updateBy),
      frequency: new FormControl(reportCriteriaRawValue.frequency),
      reportId: new FormControl(reportCriteriaRawValue.reportId),
    });
  }

  getReportCriteria(form: ReportCriteriaFormGroup): IReportCriteria | NewReportCriteria {
    return this.convertReportCriteriaRawValueToReportCriteria(
      form.getRawValue() as ReportCriteriaFormRawValue | NewReportCriteriaFormRawValue,
    );
  }

  resetForm(form: ReportCriteriaFormGroup, reportCriteria: ReportCriteriaFormGroupInput): void {
    const reportCriteriaRawValue = this.convertReportCriteriaToReportCriteriaRawValue({ ...this.getFormDefaults(), ...reportCriteria });
    form.reset(
      {
        ...reportCriteriaRawValue,
        id: { value: reportCriteriaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReportCriteriaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertReportCriteriaRawValueToReportCriteria(
    rawReportCriteria: ReportCriteriaFormRawValue | NewReportCriteriaFormRawValue,
  ): IReportCriteria | NewReportCriteria {
    return {
      ...rawReportCriteria,
      createdAt: dayjs(rawReportCriteria.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawReportCriteria.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertReportCriteriaToReportCriteriaRawValue(
    reportCriteria: IReportCriteria | (Partial<NewReportCriteria> & ReportCriteriaFormDefaults),
  ): ReportCriteriaFormRawValue | PartialWithRequiredKeyOf<NewReportCriteriaFormRawValue> {
    return {
      ...reportCriteria,
      createdAt: reportCriteria.createdAt ? reportCriteria.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: reportCriteria.updatedAt ? reportCriteria.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
