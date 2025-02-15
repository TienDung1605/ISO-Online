import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IReportTitle } from '../report-title.model';
import { ReportTitleService } from '../service/report-title.service';
import { ReportTitleFormService, ReportTitleFormGroup } from './report-title-form.service';

@Component({
  standalone: true,
  selector: 'jhi-report-title-update',
  templateUrl: './report-title-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReportTitleUpdateComponent implements OnInit {
  isSaving = false;
  reportTitle: IReportTitle | null = null;

  protected reportTitleService = inject(ReportTitleService);
  protected reportTitleFormService = inject(ReportTitleFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReportTitleFormGroup = this.reportTitleFormService.createReportTitleFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reportTitle }) => {
      this.reportTitle = reportTitle;
      if (reportTitle) {
        this.updateForm(reportTitle);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reportTitle = this.reportTitleFormService.getReportTitle(this.editForm);
    if (reportTitle.id !== null) {
      this.subscribeToSaveResponse(this.reportTitleService.update(reportTitle));
    } else {
      this.subscribeToSaveResponse(this.reportTitleService.create(reportTitle));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReportTitle>>): void {
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

  protected updateForm(reportTitle: IReportTitle): void {
    this.reportTitle = reportTitle;
    this.reportTitleFormService.resetForm(this.editForm, reportTitle);
  }
}
