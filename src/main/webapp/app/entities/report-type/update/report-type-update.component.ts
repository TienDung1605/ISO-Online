import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IReportType } from '../report-type.model';
import { ReportTypeService } from '../service/report-type.service';
import { ReportTypeFormService, ReportTypeFormGroup } from './report-type-form.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import dayjs from 'dayjs/esm';
import { DropdownModule } from 'primeng/dropdown';
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
  //set list status
  listStatus = [{ label: 'ACTIVE' }, { label: 'DEACTIVATE' }];
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
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    var reportType = this.reportTypeFormService.getReportType(this.editForm);

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

  protected updateForm(reportType: IReportType): void {
    this.reportType = reportType;
    this.reportTypeFormService.resetForm(this.editForm, reportType);
  }
}
