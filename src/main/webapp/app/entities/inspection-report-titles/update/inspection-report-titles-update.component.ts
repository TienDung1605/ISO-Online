import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInspectionReportTitles } from '../inspection-report-titles.model';
import { InspectionReportTitlesService } from '../service/inspection-report-titles.service';
import { InspectionReportTitlesFormService, InspectionReportTitlesFormGroup } from './inspection-report-titles-form.service';

@Component({
  standalone: true,
  selector: 'jhi-inspection-report-titles-update',
  templateUrl: './inspection-report-titles-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InspectionReportTitlesUpdateComponent implements OnInit {
  isSaving = false;
  inspectionReportTitles: IInspectionReportTitles | null = null;

  protected inspectionReportTitlesService = inject(InspectionReportTitlesService);
  protected inspectionReportTitlesFormService = inject(InspectionReportTitlesFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: InspectionReportTitlesFormGroup = this.inspectionReportTitlesFormService.createInspectionReportTitlesFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inspectionReportTitles }) => {
      this.inspectionReportTitles = inspectionReportTitles;
      if (inspectionReportTitles) {
        this.updateForm(inspectionReportTitles);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const inspectionReportTitles = this.inspectionReportTitlesFormService.getInspectionReportTitles(this.editForm);
    if (inspectionReportTitles.id !== null) {
      this.subscribeToSaveResponse(this.inspectionReportTitlesService.update(inspectionReportTitles));
    } else {
      this.subscribeToSaveResponse(this.inspectionReportTitlesService.create(inspectionReportTitles));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInspectionReportTitles>>): void {
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

  protected updateForm(inspectionReportTitles: IInspectionReportTitles): void {
    this.inspectionReportTitles = inspectionReportTitles;
    this.inspectionReportTitlesFormService.resetForm(this.editForm, inspectionReportTitles);
  }
}
