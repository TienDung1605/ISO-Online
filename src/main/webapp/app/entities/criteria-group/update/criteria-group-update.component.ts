import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICriteriaGroup } from '../criteria-group.model';
import { CriteriaGroupService } from '../service/criteria-group.service';
import { CriteriaGroupFormService, CriteriaGroupFormGroup } from './criteria-group-form.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-criteria-group-update',
  templateUrl: './criteria-group-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CriteriaGroupUpdateComponent implements OnInit {
  isSaving = false;
  criteriaGroup: ICriteriaGroup | null = null;
  account: Account | null = null;
  protected criteriaGroupService = inject(CriteriaGroupService);
  protected criteriaGroupFormService = inject(CriteriaGroupFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CriteriaGroupFormGroup = this.criteriaGroupFormService.createCriteriaGroupFormGroup();

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.activatedRoute.data.subscribe(({ criteriaGroup }) => {
      this.criteriaGroup = criteriaGroup;
      if (criteriaGroup) {
        this.updateForm(criteriaGroup);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const criteriaGroup = this.criteriaGroupFormService.getCriteriaGroup(this.editForm);
    if (criteriaGroup.id !== null) {
      criteriaGroup.updatedAt = dayjs(new Date());
      criteriaGroup.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.criteriaGroupService.update(criteriaGroup));
    } else {
      criteriaGroup.createdAt = dayjs(new Date());
      criteriaGroup.updatedAt = dayjs(new Date());
      criteriaGroup.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.criteriaGroupService.create(criteriaGroup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteriaGroup>>): void {
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

  protected updateForm(criteriaGroup: ICriteriaGroup): void {
    this.criteriaGroup = criteriaGroup;
    this.criteriaGroupFormService.resetForm(this.editForm, criteriaGroup);
  }
}
