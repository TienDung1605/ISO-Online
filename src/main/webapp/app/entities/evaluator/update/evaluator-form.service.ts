import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEvaluator, NewEvaluator } from '../evaluator.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvaluator for edit and NewEvaluatorFormGroupInput for create.
 */
type EvaluatorFormGroupInput = IEvaluator | PartialWithRequiredKeyOf<NewEvaluator>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEvaluator | NewEvaluator> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type EvaluatorFormRawValue = FormValueOf<IEvaluator>;

type NewEvaluatorFormRawValue = FormValueOf<NewEvaluator>;

type EvaluatorFormDefaults = Pick<NewEvaluator, 'id' | 'createdAt' | 'updatedAt'>;

type EvaluatorFormGroupContent = {
  id: FormControl<EvaluatorFormRawValue['id'] | NewEvaluator['id']>;
  name: FormControl<EvaluatorFormRawValue['name']>;
  userGroupId: FormControl<EvaluatorFormRawValue['userGroupId']>;
  createdAt: FormControl<EvaluatorFormRawValue['createdAt']>;
  updatedAt: FormControl<EvaluatorFormRawValue['updatedAt']>;
  status: FormControl<EvaluatorFormRawValue['status']>;
  updateBy: FormControl<EvaluatorFormRawValue['updateBy']>;
};

export type EvaluatorFormGroup = FormGroup<EvaluatorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EvaluatorFormService {
  createEvaluatorFormGroup(evaluator: EvaluatorFormGroupInput = { id: null }): EvaluatorFormGroup {
    const evaluatorRawValue = this.convertEvaluatorToEvaluatorRawValue({
      ...this.getFormDefaults(),
      ...evaluator,
    });
    return new FormGroup<EvaluatorFormGroupContent>({
      id: new FormControl(
        { value: evaluatorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(evaluatorRawValue.name),
      userGroupId: new FormControl(evaluatorRawValue.userGroupId),
      createdAt: new FormControl(evaluatorRawValue.createdAt),
      updatedAt: new FormControl(evaluatorRawValue.updatedAt),
      status: new FormControl(evaluatorRawValue.status),
      updateBy: new FormControl(evaluatorRawValue.updateBy),
    });
  }

  getEvaluator(form: EvaluatorFormGroup): IEvaluator | NewEvaluator {
    return this.convertEvaluatorRawValueToEvaluator(form.getRawValue() as EvaluatorFormRawValue | NewEvaluatorFormRawValue);
  }

  resetForm(form: EvaluatorFormGroup, evaluator: EvaluatorFormGroupInput): void {
    const evaluatorRawValue = this.convertEvaluatorToEvaluatorRawValue({ ...this.getFormDefaults(), ...evaluator });
    form.reset(
      {
        ...evaluatorRawValue,
        id: { value: evaluatorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EvaluatorFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertEvaluatorRawValueToEvaluator(rawEvaluator: EvaluatorFormRawValue | NewEvaluatorFormRawValue): IEvaluator | NewEvaluator {
    return {
      ...rawEvaluator,
      createdAt: dayjs(rawEvaluator.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawEvaluator.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertEvaluatorToEvaluatorRawValue(
    evaluator: IEvaluator | (Partial<NewEvaluator> & EvaluatorFormDefaults),
  ): EvaluatorFormRawValue | PartialWithRequiredKeyOf<NewEvaluatorFormRawValue> {
    return {
      ...evaluator,
      createdAt: evaluator.createdAt ? evaluator.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: evaluator.updatedAt ? evaluator.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
