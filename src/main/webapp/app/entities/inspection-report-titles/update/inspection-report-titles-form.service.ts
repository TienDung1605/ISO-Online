import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInspectionReportTitles, NewInspectionReportTitles } from '../inspection-report-titles.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInspectionReportTitles for edit and NewInspectionReportTitlesFormGroupInput for create.
 */
type InspectionReportTitlesFormGroupInput = IInspectionReportTitles | PartialWithRequiredKeyOf<NewInspectionReportTitles>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInspectionReportTitles | NewInspectionReportTitles> = Omit<T, 'timeCreate' | 'timeUpdate'> & {
  timeCreate?: string | null;
  timeUpdate?: string | null;
};

type InspectionReportTitlesFormRawValue = FormValueOf<IInspectionReportTitles>;

type NewInspectionReportTitlesFormRawValue = FormValueOf<NewInspectionReportTitles>;

type InspectionReportTitlesFormDefaults = Pick<NewInspectionReportTitles, 'id' | 'timeCreate' | 'timeUpdate'>;

type InspectionReportTitlesFormGroupContent = {
  id: FormControl<InspectionReportTitlesFormRawValue['id'] | NewInspectionReportTitles['id']>;
  nameTitle: FormControl<InspectionReportTitlesFormRawValue['nameTitle']>;
  source: FormControl<InspectionReportTitlesFormRawValue['source']>;
  field: FormControl<InspectionReportTitlesFormRawValue['field']>;
  dataType: FormControl<InspectionReportTitlesFormRawValue['dataType']>;
  timeCreate: FormControl<InspectionReportTitlesFormRawValue['timeCreate']>;
  timeUpdate: FormControl<InspectionReportTitlesFormRawValue['timeUpdate']>;
  sampleReportId: FormControl<InspectionReportTitlesFormRawValue['sampleReportId']>;
};

export type InspectionReportTitlesFormGroup = FormGroup<InspectionReportTitlesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InspectionReportTitlesFormService {
  createInspectionReportTitlesFormGroup(
    inspectionReportTitles: InspectionReportTitlesFormGroupInput = { id: null },
  ): InspectionReportTitlesFormGroup {
    const inspectionReportTitlesRawValue = this.convertInspectionReportTitlesToInspectionReportTitlesRawValue({
      ...this.getFormDefaults(),
      ...inspectionReportTitles,
    });
    return new FormGroup<InspectionReportTitlesFormGroupContent>({
      id: new FormControl(
        { value: inspectionReportTitlesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nameTitle: new FormControl(inspectionReportTitlesRawValue.nameTitle),
      source: new FormControl(inspectionReportTitlesRawValue.source),
      field: new FormControl(inspectionReportTitlesRawValue.field),
      dataType: new FormControl(inspectionReportTitlesRawValue.dataType),
      timeCreate: new FormControl(inspectionReportTitlesRawValue.timeCreate),
      timeUpdate: new FormControl(inspectionReportTitlesRawValue.timeUpdate),
      sampleReportId: new FormControl(inspectionReportTitlesRawValue.sampleReportId),
    });
  }

  getInspectionReportTitles(form: InspectionReportTitlesFormGroup): IInspectionReportTitles | NewInspectionReportTitles {
    return this.convertInspectionReportTitlesRawValueToInspectionReportTitles(
      form.getRawValue() as InspectionReportTitlesFormRawValue | NewInspectionReportTitlesFormRawValue,
    );
  }

  resetForm(form: InspectionReportTitlesFormGroup, inspectionReportTitles: InspectionReportTitlesFormGroupInput): void {
    const inspectionReportTitlesRawValue = this.convertInspectionReportTitlesToInspectionReportTitlesRawValue({
      ...this.getFormDefaults(),
      ...inspectionReportTitles,
    });
    form.reset(
      {
        ...inspectionReportTitlesRawValue,
        id: { value: inspectionReportTitlesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InspectionReportTitlesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timeCreate: currentTime,
      timeUpdate: currentTime,
    };
  }

  private convertInspectionReportTitlesRawValueToInspectionReportTitles(
    rawInspectionReportTitles: InspectionReportTitlesFormRawValue | NewInspectionReportTitlesFormRawValue,
  ): IInspectionReportTitles | NewInspectionReportTitles {
    return {
      ...rawInspectionReportTitles,
      timeCreate: dayjs(rawInspectionReportTitles.timeCreate, DATE_TIME_FORMAT),
      timeUpdate: dayjs(rawInspectionReportTitles.timeUpdate, DATE_TIME_FORMAT),
    };
  }

  private convertInspectionReportTitlesToInspectionReportTitlesRawValue(
    inspectionReportTitles: IInspectionReportTitles | (Partial<NewInspectionReportTitles> & InspectionReportTitlesFormDefaults),
  ): InspectionReportTitlesFormRawValue | PartialWithRequiredKeyOf<NewInspectionReportTitlesFormRawValue> {
    return {
      ...inspectionReportTitles,
      timeCreate: inspectionReportTitles.timeCreate ? inspectionReportTitles.timeCreate.format(DATE_TIME_FORMAT) : undefined,
      timeUpdate: inspectionReportTitles.timeUpdate ? inspectionReportTitles.timeUpdate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
