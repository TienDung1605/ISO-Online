import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICheckerGroup } from '../checker-group.model';
import { CheckerGroupService } from '../service/checker-group.service';
import { CheckerGroupFormService, CheckerGroupFormGroup } from './checker-group-form.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-checker-group-update',
  templateUrl: './checker-group-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CheckerGroupUpdateComponent implements OnInit {
  isSaving = false;
  checkerGroup: ICheckerGroup | null = null;
  account: Account | null = null;
  protected checkerGroupService = inject(CheckerGroupService);
  protected checkerGroupFormService = inject(CheckerGroupFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CheckerGroupFormGroup = this.checkerGroupFormService.createCheckerGroupFormGroup();

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.activatedRoute.data.subscribe(({ checkerGroup }) => {
      this.checkerGroup = checkerGroup;
      if (checkerGroup) {
        this.updateForm(checkerGroup);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const checkerGroup = this.checkerGroupFormService.getCheckerGroup(this.editForm);
    if (checkerGroup.id !== null) {
      checkerGroup.updatedAt = dayjs(new Date());
      checkerGroup.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.checkerGroupService.update(checkerGroup));
    } else {
      checkerGroup.createdAt = dayjs(new Date());
      checkerGroup.updatedAt = dayjs(new Date());
      checkerGroup.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.checkerGroupService.create(checkerGroup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICheckerGroup>>): void {
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

  protected updateForm(checkerGroup: ICheckerGroup): void {
    this.checkerGroup = checkerGroup;
    this.checkerGroupFormService.resetForm(this.editForm, checkerGroup);
  }
}
