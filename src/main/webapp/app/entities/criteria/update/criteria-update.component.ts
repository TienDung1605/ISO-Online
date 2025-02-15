import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICriteria } from '../criteria.model';
import { CriteriaService } from '../service/criteria.service';
import { CriteriaFormService, CriteriaFormGroup } from './criteria-form.service';

@Component({
  standalone: true,
  selector: 'jhi-criteria-update',
  templateUrl: './criteria-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CriteriaUpdateComponent implements OnInit {
  isSaving = false;
  criteria: ICriteria | null = null;

  protected criteriaService = inject(CriteriaService);
  protected criteriaFormService = inject(CriteriaFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CriteriaFormGroup = this.criteriaFormService.createCriteriaFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteria }) => {
      this.criteria = criteria;
      if (criteria) {
        this.updateForm(criteria);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const criteria = this.criteriaFormService.getCriteria(this.editForm);
    if (criteria.id !== null) {
      this.subscribeToSaveResponse(this.criteriaService.update(criteria));
    } else {
      this.subscribeToSaveResponse(this.criteriaService.create(criteria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteria>>): void {
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

  protected updateForm(criteria: ICriteria): void {
    this.criteria = criteria;
    this.criteriaFormService.resetForm(this.editForm, criteria);
  }
}
