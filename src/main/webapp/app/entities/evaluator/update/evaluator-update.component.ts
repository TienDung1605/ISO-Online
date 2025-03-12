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
import { CheckerGroupService } from 'app/entities/checker-group/service/checker-group.service';
import Swal from 'sweetalert2';

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
  checkerGroups: any[] = [];
  name = '';
  protected evaluatorService = inject(EvaluatorService);
  protected evaluatorFormService = inject(EvaluatorFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  protected checkerGroupService = inject(CheckerGroupService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EvaluatorFormGroup = this.evaluatorFormService.createEvaluatorFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ evaluator }) => {
      this.evaluator = evaluator;
      if (evaluator) {
        this.updateForm(evaluator);
      } else {
        this.editForm.patchValue({
          status: 'ACTIVE',
        });
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
    this.loadCheckerGroups();
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const evaluator = this.evaluatorFormService.getEvaluator(this.editForm);
    // if (this.account) {
    //   evaluator.updateBy = this.account.login;
    //   evaluator.createdAt = dayjs();
    //   evaluator.updatedAt = dayjs();
    //   // evaluator.status = this.status
    // }
    if (evaluator.id !== null) {
      evaluator.updatedAt = dayjs(new Date());
      evaluator.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.evaluatorService.update(evaluator));
    } else {
      evaluator.createdAt = dayjs(new Date());
      evaluator.updatedAt = dayjs(new Date());
      evaluator.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.evaluatorService.create(evaluator));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvaluator>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => {
        Swal.mixin({
          toast: true,
          position: 'top-end',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen(toast) {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: 'success',
          title: this.evaluator?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
        });
        this.onSaveSuccess();
      },
      error: () => {
        Swal.mixin({
          toast: true,
          position: 'top-end',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen(toast) {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: 'success',
          title: this.evaluator?.id ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!',
        });
        this.onSaveError();
      },
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

  protected loadCheckerGroups(): void {
    this.checkerGroupService.getAllCheckerGroups().subscribe(data => {
      this.checkerGroups = data;
    });
  }

  protected updateCheckerGroup(): void {
    const checkerGroup = this.checkerGroups.find((s: any) => s.name === this.name);
    if (checkerGroup) {
      this.editForm.patchValue({ userGroupId: checkerGroup.id });
    }
  }
  protected updateForm(evaluator: IEvaluator): void {
    this.evaluator = evaluator;
    this.evaluatorFormService.resetForm(this.editForm, evaluator);
    this.checkerGroupService.query().subscribe((res: any) => {
      if (res.body) {
        this.checkerGroups = res.body;
        const checkerGroup = res.body.find((s: any) => s.id === this.evaluator?.userGroupId);
        if (checkerGroup) {
          this.name = checkerGroup.name;
          console.log('check form', checkerGroup.name);
        }
      }
    });
  }
}
