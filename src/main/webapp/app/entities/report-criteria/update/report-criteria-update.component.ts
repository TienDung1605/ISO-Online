import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IReportCriteria } from '../report-criteria.model';
import { ReportCriteriaService } from '../service/report-criteria.service';
import { ReportCriteriaFormService, ReportCriteriaFormGroup } from './report-criteria-form.service';

@Component({
  standalone: true,
  selector: 'jhi-report-criteria-update',
  templateUrl: './report-criteria-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReportCriteriaUpdateComponent implements OnInit {
  isSaving = false;
  reportCriteria: IReportCriteria | null = null;

  protected reportCriteriaService = inject(ReportCriteriaService);
  protected reportCriteriaFormService = inject(ReportCriteriaFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReportCriteriaFormGroup = this.reportCriteriaFormService.createReportCriteriaFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reportCriteria }) => {
      this.reportCriteria = reportCriteria;
      if (reportCriteria) {
        this.updateForm(reportCriteria);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reportCriteria = this.reportCriteriaFormService.getReportCriteria(this.editForm);
    if (reportCriteria.id !== null) {
      this.subscribeToSaveResponse(this.reportCriteriaService.update(reportCriteria));
    } else {
      this.subscribeToSaveResponse(this.reportCriteriaService.create(reportCriteria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReportCriteria>>): void {
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

  protected updateForm(reportCriteria: IReportCriteria): void {
    this.reportCriteria = reportCriteria;
    this.reportCriteriaFormService.resetForm(this.editForm, reportCriteria);
  }
}
