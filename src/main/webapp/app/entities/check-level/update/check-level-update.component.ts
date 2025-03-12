import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICheckLevel } from '../check-level.model';
import { CheckLevelService } from '../service/check-level.service';
import { CheckLevelFormService, CheckLevelFormGroup } from './check-level-form.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'jhi-check-level-update',
  templateUrl: './check-level-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CheckLevelUpdateComponent implements OnInit {
  isSaving = false;
  checkLevel: ICheckLevel | null = null;
  account: Account | null = null;
  protected checkLevelService = inject(CheckLevelService);
  protected checkLevelFormService = inject(CheckLevelFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CheckLevelFormGroup = this.checkLevelFormService.createCheckLevelFormGroup();

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.activatedRoute.data.subscribe(({ checkLevel }) => {
      this.checkLevel = checkLevel;
      if (checkLevel) {
        this.updateForm(checkLevel);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const checkLevel = this.checkLevelFormService.getCheckLevel(this.editForm);
    if (checkLevel.id !== null) {
      checkLevel.updatedAt = dayjs(new Date());
      checkLevel.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.checkLevelService.update(checkLevel));
    } else {
      checkLevel.createdAt = dayjs(new Date());
      checkLevel.updatedAt = dayjs(new Date());
      checkLevel.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.checkLevelService.create(checkLevel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICheckLevel>>): void {
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
          title: this.checkLevel?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
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
          title: this.checkLevel?.id ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!',
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

  protected updateForm(checkLevel: ICheckLevel): void {
    this.checkLevel = checkLevel;
    this.checkLevelFormService.resetForm(this.editForm, checkLevel);
  }
}
