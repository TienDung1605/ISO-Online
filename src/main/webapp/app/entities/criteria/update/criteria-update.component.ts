import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { ICriteria } from '../criteria.model';
import { CriteriaService } from '../service/criteria.service';
import { CriteriaFormService, CriteriaFormGroup } from './criteria-form.service';
import Swal from 'sweetalert2';
import { CriteriaGroupService } from 'app/entities/criteria-group/service/criteria-group.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-criteria-update',
  templateUrl: './criteria-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CriteriaUpdateComponent implements OnInit {
  isSaving = false;
  criteria: ICriteria | null = null;
  account: Account | null = null;
  criteriaGroups: any[] = [];
  name = '';

  protected criteriaService = inject(CriteriaService);
  protected criteriaFormService = inject(CriteriaFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected criteriaGroupService = inject(CriteriaGroupService);
  protected accountService = inject(AccountService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CriteriaFormGroup = this.criteriaFormService.createCriteriaFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteria }) => {
      this.criteria = criteria;
      if (criteria) {
        this.updateForm(criteria);
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
    this.loadCriateriaGroups();
  }

  previousState(): void {
    window.history.back();
  }

  duplicateNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    return this.criteriaService.checkNameExists(control.value).pipe(
      map(isDuplicate => (isDuplicate ? { duplicate: true } : null)),
      catchError(() => of(null)),
    );
  }

  save(): void {
    this.isSaving = true;
    const criteria = this.criteriaFormService.getCriteria(this.editForm);
    if (this.editForm.invalid) {
      this.markAllAsTouched();
      this.showValidationError();
      return;
    }
    if (criteria.id !== null) {
      criteria.updatedAt = dayjs(new Date());
      criteria.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.criteriaService.update(criteria));
    } else {
      criteria.createdAt = dayjs(new Date());
      criteria.updatedAt = dayjs(new Date());
      criteria.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.criteriaService.create(criteria));
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteria>>): void {
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
          title: this.criteria?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
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
          title: this.criteria?.id ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!',
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
  protected loadCriateriaGroups(): void {
    this.criteriaService.getAllCriteriaGroups().subscribe(data => {
      this.criteriaGroups = data;
    });
  }

  protected updateCritetiaGroup(): void {
    const criteriaGroup = this.criteriaGroups.find((s: any) => s.name === this.name);
    if (criteriaGroup) {
      this.editForm.patchValue({ criterialGroupId: criteriaGroup.id });
    } else {
      this.editForm.patchValue({
        criterialGroupId: null,
      });
    }
  }

  protected updateForm(criteria: ICriteria): void {
    this.criteria = criteria;
    this.criteriaFormService.resetForm(this.editForm, criteria);
    this.criteriaGroupService.query().subscribe((res: any) => {
      if (res.body) {
        this.criteriaGroups = res.body;
        const checkerGroup = res.body.find((s: any) => s.id === this.criteria?.criterialGroupId);
        if (checkerGroup) {
          this.name = checkerGroup.name;
          console.log('check form', checkerGroup.name);
        }
      }
    });
  }
}
