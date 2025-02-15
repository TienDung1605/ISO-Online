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

@Component({
  standalone: true,
  selector: 'jhi-report-type-update',
  templateUrl: './report-type-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReportTypeUpdateComponent implements OnInit {
  isSaving = false;
  reportType: IReportType | null = null;

  protected reportTypeService = inject(ReportTypeService);
  protected reportTypeFormService = inject(ReportTypeFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReportTypeFormGroup = this.reportTypeFormService.createReportTypeFormGroup();

  ngOnInit(): void {
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
    const reportType = this.reportTypeFormService.getReportType(this.editForm);
    if (reportType.id !== null) {
      this.subscribeToSaveResponse(this.reportTypeService.update(reportType));
    } else {
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
