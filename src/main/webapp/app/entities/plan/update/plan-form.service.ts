import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPlan, NewPlan } from '../plan.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlan for edit and NewPlanFormGroupInput for create.
 */
type PlanFormGroupInput = IPlan | PartialWithRequiredKeyOf<NewPlan>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPlan | NewPlan> = Omit<T, 'timeStart' | 'timeEnd' | 'createdAt' | 'updatedAt'> & {
  timeStart?: string | null;
  timeEnd?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type PlanFormRawValue = FormValueOf<IPlan>;

type NewPlanFormRawValue = FormValueOf<NewPlan>;

type PlanFormDefaults = Pick<NewPlan, 'id' | 'timeStart' | 'timeEnd' | 'createdAt' | 'updatedAt'>;

type PlanFormGroupContent = {
  id: FormControl<PlanFormRawValue['id'] | NewPlan['id']>;
  code: FormControl<PlanFormRawValue['code']>;
  name: FormControl<PlanFormRawValue['name']>;
  subjectOfAssetmentPlan: FormControl<PlanFormRawValue['subjectOfAssetmentPlan']>;
  frequency: FormControl<PlanFormRawValue['frequency']>;
  timeStart: FormControl<PlanFormRawValue['timeStart']>;
  timeEnd: FormControl<PlanFormRawValue['timeEnd']>;
  statusPlan: FormControl<PlanFormRawValue['statusPlan']>;
  testObject: FormControl<PlanFormRawValue['testObject']>;
  reportTypeId: FormControl<PlanFormRawValue['reportTypeId']>;
  reportTypeName: FormControl<PlanFormRawValue['reportTypeName']>;
  numberOfCheck: FormControl<PlanFormRawValue['numberOfCheck']>;
  implementer: FormControl<PlanFormRawValue['implementer']>;
  paticipant: FormControl<PlanFormRawValue['paticipant']>;
  checkerGroup: FormControl<PlanFormRawValue['checkerGroup']>;
  checkerName: FormControl<PlanFormRawValue['checkerName']>;
  checkerGroupId: FormControl<PlanFormRawValue['checkerGroupId']>;
  checkerId: FormControl<PlanFormRawValue['checkerId']>;
  gross: FormControl<PlanFormRawValue['gross']>;
  timeCheck: FormControl<PlanFormRawValue['timeCheck']>;
  nameResult: FormControl<PlanFormRawValue['nameResult']>;
  scriptId: FormControl<PlanFormRawValue['scriptId']>;
  createBy: FormControl<PlanFormRawValue['createBy']>;
  status: FormControl<PlanFormRawValue['status']>;
  createdAt: FormControl<PlanFormRawValue['createdAt']>;
  updatedAt: FormControl<PlanFormRawValue['updatedAt']>;
  updateBy: FormControl<PlanFormRawValue['updateBy']>;
};

export type PlanFormGroup = FormGroup<PlanFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlanFormService {
  createPlanFormGroup(plan: PlanFormGroupInput = { id: null }): PlanFormGroup {
    const planRawValue = this.convertPlanToPlanRawValue({
      ...this.getFormDefaults(),
      ...plan,
    });
    return new FormGroup<PlanFormGroupContent>({
      id: new FormControl(
        { value: planRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(planRawValue.code),
      name: new FormControl(planRawValue.name),
      subjectOfAssetmentPlan: new FormControl(planRawValue.subjectOfAssetmentPlan),
      frequency: new FormControl(planRawValue.frequency),
      timeStart: new FormControl(planRawValue.timeStart),
      timeEnd: new FormControl(planRawValue.timeEnd),
      statusPlan: new FormControl(planRawValue.statusPlan),
      testObject: new FormControl(planRawValue.testObject),
      reportTypeId: new FormControl(planRawValue.reportTypeId),
      reportTypeName: new FormControl(planRawValue.reportTypeName),
      numberOfCheck: new FormControl(planRawValue.numberOfCheck),
      implementer: new FormControl(planRawValue.implementer),
      paticipant: new FormControl(planRawValue.paticipant),
      checkerGroup: new FormControl(planRawValue.checkerGroup),
      checkerName: new FormControl(planRawValue.checkerName),
      checkerGroupId: new FormControl(planRawValue.checkerGroupId),
      checkerId: new FormControl(planRawValue.checkerId),
      gross: new FormControl(planRawValue.gross),
      timeCheck: new FormControl(planRawValue.timeCheck),
      nameResult: new FormControl(planRawValue.nameResult),
      scriptId: new FormControl(planRawValue.scriptId),
      createBy: new FormControl(planRawValue.createBy),
      status: new FormControl(planRawValue.status),
      createdAt: new FormControl(planRawValue.createdAt),
      updatedAt: new FormControl(planRawValue.updatedAt),
      updateBy: new FormControl(planRawValue.updateBy),
    });
  }

  getPlan(form: PlanFormGroup): IPlan | NewPlan {
    return this.convertPlanRawValueToPlan(form.getRawValue() as PlanFormRawValue | NewPlanFormRawValue);
  }

  resetForm(form: PlanFormGroup, plan: PlanFormGroupInput): void {
    const planRawValue = this.convertPlanToPlanRawValue({ ...this.getFormDefaults(), ...plan });
    form.reset(
      {
        ...planRawValue,
        id: { value: planRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PlanFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timeStart: currentTime,
      timeEnd: currentTime,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertPlanRawValueToPlan(rawPlan: PlanFormRawValue | NewPlanFormRawValue): IPlan | NewPlan {
    return {
      ...rawPlan,
      timeStart: dayjs(rawPlan.timeStart, DATE_TIME_FORMAT),
      timeEnd: dayjs(rawPlan.timeEnd, DATE_TIME_FORMAT),
      createdAt: dayjs(rawPlan.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawPlan.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertPlanToPlanRawValue(
    plan: IPlan | (Partial<NewPlan> & PlanFormDefaults),
  ): PlanFormRawValue | PartialWithRequiredKeyOf<NewPlanFormRawValue> {
    return {
      ...plan,
      timeStart: plan.timeStart ? plan.timeStart.format(DATE_TIME_FORMAT) : undefined,
      timeEnd: plan.timeEnd ? plan.timeEnd.format(DATE_TIME_FORMAT) : undefined,
      createdAt: plan.createdAt ? plan.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: plan.updatedAt ? plan.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
