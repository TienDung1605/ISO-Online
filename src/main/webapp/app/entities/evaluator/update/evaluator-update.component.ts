import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEvaluator } from '../evaluator.model';
import { EvaluatorService } from '../service/evaluator.service';
import { EvaluatorFormService, EvaluatorFormGroup } from './evaluator-form.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-evaluator-update',
  templateUrl: './evaluator-update.component.html',
  styleUrls: ['../../shared.component.css'],

  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EvaluatorUpdateComponent implements OnInit {
  isSaving = false;
  evaluator: IEvaluator | null = null;
  account: Account | null = null;

  protected evaluatorService = inject(EvaluatorService);
  protected evaluatorFormService = inject(EvaluatorFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EvaluatorFormGroup = this.evaluatorFormService.createEvaluatorFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ evaluator }) => {
      this.evaluator = evaluator;
      if (evaluator) {
        this.updateForm(evaluator);
      }
    });
    this.accountService.identity().subscribe(account => {
      this.account = account;

      if (account) {
        this.editForm.patchValue({
          updateBy: account.login,
        });
      }
    });

    this.activatedRoute.data.subscribe(({ evaluator }) => {
      this.evaluator = evaluator;
      if (evaluator) {
        this.updateForm(evaluator);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const evaluator = this.evaluatorFormService.getEvaluator(this.editForm);
    if (this.account) {
      evaluator.updateBy = this.account.login;
      evaluator.createdAt = dayjs();
      evaluator.updatedAt = dayjs();
      // evaluator.status = this.status
    }
    if (evaluator.id !== null) {
      this.subscribeToSaveResponse(this.evaluatorService.update(evaluator));
    } else {
      this.subscribeToSaveResponse(this.evaluatorService.create(evaluator));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvaluator>>): void {
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

  protected updateForm(evaluator: IEvaluator): void {
    this.evaluator = evaluator;
    this.evaluatorFormService.resetForm(this.editForm, evaluator);
  }
}
