import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { ICriteriaGroup } from '../criteria-group.model';
import { CriteriaGroupService } from '../service/criteria-group.service';
import { CriteriaGroupFormService, CriteriaGroupFormGroup } from './criteria-group-form.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';
import Swal from 'sweetalert2';

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
    this.activatedRoute.data.subscribe(({ criteriaGroup }) => {
      this.criteriaGroup = criteriaGroup;
      if (criteriaGroup) {
        this.updateForm(criteriaGroup);
      } else {
        this.editForm.patchValue({
          status: 'ACTIVE',
        });
      }
    });
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.activatedRoute.data.subscribe(({ criteriaGroup }) => {
      this.criteriaGroup = criteriaGroup;
      if (criteriaGroup) {
        this.updateForm(criteriaGroup);
      }
    });
    this.editForm.get('name')?.addValidators([Validators.required]);
    this.editForm.get('name')?.setAsyncValidators([this.duplicateNameValidator.bind(this)]);
    this.editForm.get('name')?.updateValueAndValidity();
  }

  previousState(): void {
    window.history.back();
  }

  duplicateNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    return this.criteriaGroupService.checkNameExists(control.value).pipe(
      map(isDuplicate => (isDuplicate ? { duplicate: true } : null)),
      catchError(() => of(null)),
    );
  }

  save(): void {
    this.isSaving = true;
    const criteriaGroup = this.criteriaGroupFormService.getCriteriaGroup(this.editForm);
    if (this.editForm.invalid) {
      this.markAllAsTouched();
      this.showValidationError();
      return;
    }
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteriaGroup>>): void {
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
          title: this.criteriaGroup?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
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
          title: this.criteriaGroup?.id ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!',
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

  protected updateForm(criteriaGroup: ICriteriaGroup): void {
    this.criteriaGroup = criteriaGroup;
    this.criteriaGroupFormService.resetForm(this.editForm, criteriaGroup);
  }
}
