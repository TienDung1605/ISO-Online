import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISampleReportCriteria } from '../sample-report-criteria.model';
import { SampleReportCriteriaService } from '../service/sample-report-criteria.service';
import { SampleReportCriteriaFormService, SampleReportCriteriaFormGroup } from './sample-report-criteria-form.service';

@Component({
  standalone: true,
  selector: 'jhi-sample-report-criteria-update',
  templateUrl: './sample-report-criteria-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SampleReportCriteriaUpdateComponent implements OnInit {
  isSaving = false;
  sampleReportCriteria: ISampleReportCriteria | null = null;

  protected sampleReportCriteriaService = inject(SampleReportCriteriaService);
  protected sampleReportCriteriaFormService = inject(SampleReportCriteriaFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SampleReportCriteriaFormGroup = this.sampleReportCriteriaFormService.createSampleReportCriteriaFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sampleReportCriteria }) => {
      this.sampleReportCriteria = sampleReportCriteria;
      if (sampleReportCriteria) {
        this.updateForm(sampleReportCriteria);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sampleReportCriteria = this.sampleReportCriteriaFormService.getSampleReportCriteria(this.editForm);
    if (sampleReportCriteria.id !== null) {
      this.subscribeToSaveResponse(this.sampleReportCriteriaService.update(sampleReportCriteria));
    } else {
      this.subscribeToSaveResponse(this.sampleReportCriteriaService.create(sampleReportCriteria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISampleReportCriteria>>): void {
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

  protected updateForm(sampleReportCriteria: ISampleReportCriteria): void {
    this.sampleReportCriteria = sampleReportCriteria;
    this.sampleReportCriteriaFormService.resetForm(this.editForm, sampleReportCriteria);
  }
}
