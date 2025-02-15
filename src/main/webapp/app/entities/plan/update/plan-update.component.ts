import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPlan } from '../plan.model';
import { PlanService } from '../service/plan.service';
import { PlanFormService, PlanFormGroup } from './plan-form.service';

@Component({
  standalone: true,
  selector: 'jhi-plan-update',
  templateUrl: './plan-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PlanUpdateComponent implements OnInit {
  isSaving = false;
  plan: IPlan | null = null;

  protected planService = inject(PlanService);
  protected planFormService = inject(PlanFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PlanFormGroup = this.planFormService.createPlanFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plan }) => {
      this.plan = plan;
      if (plan) {
        this.updateForm(plan);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const plan = this.planFormService.getPlan(this.editForm);
    if (plan.id !== null) {
      this.subscribeToSaveResponse(this.planService.update(plan));
    } else {
      this.subscribeToSaveResponse(this.planService.create(plan));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlan>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(plan: IPlan): void {
    this.plan = plan;
    this.planFormService.resetForm(this.editForm, plan);
  }
}
