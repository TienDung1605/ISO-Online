import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { IReportType } from '../report-type.model';
import { ReportTypeService } from '../service/report-type.service';
import { ReportTypeFormService, ReportTypeFormGroup } from './report-type-form.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import dayjs from 'dayjs/esm';
import { DropdownModule } from 'primeng/dropdown';
import Swal from 'sweetalert2';
@Component({
  standalone: true,
  selector: 'jhi-report-type-update',
  templateUrl: './report-type-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, DropdownModule],
})
export class ReportTypeUpdateComponent implements OnInit {
  isSaving = false;
  reportType: IReportType | null = null;
  account: Account | null = null;
  protected reportTypeService = inject(ReportTypeService);
  protected reportTypeFormService = inject(ReportTypeFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  protected formBuilder = inject(FormBuilder);

  //set list status
  // listStatus = [{ label: 'ACTIVE' }, { label: 'DEACTIVATE' }];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReportTypeFormGroup = this.reportTypeFormService.createReportTypeFormGroup();

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      console.log('tai khoan', this.account);
    });
    this.activatedRoute.data.subscribe(({ reportType }) => {
      this.reportType = reportType;
      if (reportType) {
        this.updateForm(reportType);
      } else {
        this.editForm.patchValue({
          status: 'ACTIVE',
        });
      }
      this.editForm.get('name')?.valueChanges.subscribe(value => {
        if (value) {
          this.generateCode(value);
        }
      });
    });
  }

  generateCode(name: string): void {
    const currentDate = dayjs().format('DDMMYYYYHHmm');
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    const code = `${initials}-${currentDate}`;
    this.editForm.patchValue({ code });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reportType = this.reportTypeFormService.getReportType(this.editForm);

    if (reportType.id !== null) {
      reportType.updatedAt = dayjs(new Date());
      reportType.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.reportTypeService.update(reportType));
    } else {
      reportType.createdAt = dayjs(new Date());
      reportType.updatedAt = dayjs(new Date());
      reportType.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.reportTypeService.create(reportType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReportType>>): void {
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
          title: this.reportType?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
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
          title: this.reportType?.id ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!',
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

  protected updateForm(reportType: IReportType): void {
    this.reportType = reportType;
    this.reportTypeFormService.resetForm(this.editForm, reportType);
  }
}
