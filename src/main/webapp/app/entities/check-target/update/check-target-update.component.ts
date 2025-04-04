import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { ICheckTarget } from '../check-target.model';
import { CheckTargetService } from '../service/check-target.service';
import { CheckTargetFormService, CheckTargetFormGroup } from './check-target-form.service';
import { CheckLevelService } from 'app/entities/check-level/service/check-level.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import Swal from 'sweetalert2';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-check-target-update',
  templateUrl: './check-target-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CheckTargetUpdateComponent implements OnInit {
  isSaving = false;
  checkTarget: ICheckTarget | null = null;
  account: Account | null = null;
  checkLevels: any[] = [];
  name = '';
  protected checkTargetService = inject(CheckTargetService);
  protected checkTargetFormService = inject(CheckTargetFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  protected checkLevelService = inject(CheckLevelService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CheckTargetFormGroup = this.checkTargetFormService.createCheckTargetFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ checkTarget }) => {
      this.checkTarget = checkTarget;
      if (checkTarget) {
        this.updateForm(checkTarget);
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
    this.editForm.get('name')?.addValidators([Validators.required]);
    this.editForm.get('name')?.setAsyncValidators([this.duplicateNameValidator.bind(this)]);
    this.editForm.get('name')?.updateValueAndValidity();
    this.loadCheckLevels();
  }

  previousState(): void {
    window.history.back();
  }

  duplicateNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    return this.checkTargetService.checkNameExists(control.value).pipe(
      map(isDuplicate => (isDuplicate ? { duplicate: true } : null)),
      catchError(() => of(null)),
    );
  }

  save(): void {
    this.isSaving = true;
    const checkTarget = this.checkTargetFormService.getCheckTarget(this.editForm);
    if (this.editForm.invalid) {
      this.markAllAsTouched();
      this.showValidationError();
      return;
    }
    if (checkTarget.id !== null) {
      checkTarget.updatedAt = dayjs(new Date());
      checkTarget.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.checkTargetService.update(checkTarget));
    } else {
      checkTarget.createdAt = dayjs(new Date());
      checkTarget.updatedAt = dayjs(new Date());
      checkTarget.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.checkTargetService.create(checkTarget));
    }
  }

  markAllAsTouched(): void {
    Object.values(this.editForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  showValidationError(): void {
    const errors = this.editForm.get('name')?.errors;
    let errorMessage = 'Vui lòng kiểm tra lại thông tin';

    if (errors?.['required']) {
      errorMessage = 'Tên không được để trống';
    } else if (errors?.['duplicate']) {
      errorMessage = 'Tên này đã tồn tại';
    }

    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: errorMessage,
      confirmButtonText: 'OK',
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICheckTarget>>): void {
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
          title: this.checkTarget?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
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
          title: this.checkTarget?.id ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!',
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

  protected loadCheckLevels(): void {
    this.checkLevelService.getAllCheckLevels().subscribe(data => {
      this.checkLevels = data;
    });
  }

  protected updateCheckLevel(): void {
    const checkLevel = this.checkLevels.find((s: any) => s.name === this.name);
    if (checkLevel) {
      this.editForm.patchValue({ evaluationLevelId: checkLevel.id });
    }
  }

  protected updateForm(checkTarget: ICheckTarget): void {
    this.checkTarget = checkTarget;
    this.checkTargetFormService.resetForm(this.editForm, checkTarget);
    this.checkLevelService.query().subscribe((res: any) => {
      if (res.body) {
        this.checkLevels = res.body;
        const checkLevel = res.body.find((s: any) => s.id === this.checkTarget?.evaluationLevelId);
        if (checkLevel) {
          this.name = checkLevel.name;
          console.log('check form', checkLevel.namne);
        }
      }
    });
  }
}
