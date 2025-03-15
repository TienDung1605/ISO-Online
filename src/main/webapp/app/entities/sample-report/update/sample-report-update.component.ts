import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISampleReport } from '../sample-report.model';
import { SampleReportService } from '../service/sample-report.service';
import { SampleReportFormService, SampleReportFormGroup } from './sample-report-form.service';

import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { Dialog, DialogModule } from 'primeng/dialog';

@Component({
  standalone: true,
  selector: 'jhi-sample-report-update',
  templateUrl: './sample-report-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, TableModule, IconFieldModule, InputIconModule, TagModule, DialogModule],
})
export class SampleReportUpdateComponent implements OnInit {
  isSaving = false;
  sampleReport: ISampleReport | null = null;
  visible = false;

  protected sampleReportService = inject(SampleReportService);
  protected sampleReportFormService = inject(SampleReportFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SampleReportFormGroup = this.sampleReportFormService.createSampleReportFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sampleReport }) => {
      this.sampleReport = sampleReport;
      if (sampleReport) {
        this.updateForm(sampleReport);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sampleReport = this.sampleReportFormService.getSampleReport(this.editForm);
    if (sampleReport.id !== null) {
      this.subscribeToSaveResponse(this.sampleReportService.update(sampleReport));
    } else {
      this.subscribeToSaveResponse(this.sampleReportService.create(sampleReport));
    }
  }

  showDialog(): void {
    this.visible = true;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISampleReport>>): void {
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

  protected updateForm(sampleReport: ISampleReport): void {
    this.sampleReport = sampleReport;
    this.sampleReportFormService.resetForm(this.editForm, sampleReport);
  }
}
