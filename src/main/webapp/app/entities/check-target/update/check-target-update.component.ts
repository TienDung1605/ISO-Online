import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICheckTarget } from '../check-target.model';
import { CheckTargetService } from '../service/check-target.service';
import { CheckTargetFormService, CheckTargetFormGroup } from './check-target-form.service';

@Component({
  standalone: true,
  selector: 'jhi-check-target-update',
  templateUrl: './check-target-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CheckTargetUpdateComponent implements OnInit {
  isSaving = false;
  checkTarget: ICheckTarget | null = null;

  protected checkTargetService = inject(CheckTargetService);
  protected checkTargetFormService = inject(CheckTargetFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CheckTargetFormGroup = this.checkTargetFormService.createCheckTargetFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ checkTarget }) => {
      this.checkTarget = checkTarget;
      if (checkTarget) {
        this.updateForm(checkTarget);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const checkTarget = this.checkTargetFormService.getCheckTarget(this.editForm);
    if (checkTarget.id !== null) {
      this.subscribeToSaveResponse(this.checkTargetService.update(checkTarget));
    } else {
      this.subscribeToSaveResponse(this.checkTargetService.create(checkTarget));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICheckTarget>>): void {
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

  protected updateForm(checkTarget: ICheckTarget): void {
    this.checkTarget = checkTarget;
    this.checkTargetFormService.resetForm(this.editForm, checkTarget);
  }
}
