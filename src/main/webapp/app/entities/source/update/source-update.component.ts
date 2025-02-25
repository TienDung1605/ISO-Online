import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISource } from '../source.model';
import { SourceService } from '../service/source.service';
import { SourceFormService, SourceFormGroup } from './source-form.service';

@Component({
  standalone: true,
  selector: 'jhi-source-update',
  templateUrl: './source-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SourceUpdateComponent implements OnInit {
  isSaving = false;
  source: ISource | null = null;

  protected sourceService = inject(SourceService);
  protected sourceFormService = inject(SourceFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SourceFormGroup = this.sourceFormService.createSourceFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ source }) => {
      this.source = source;
      if (source) {
        this.updateForm(source);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const source = this.sourceFormService.getSource(this.editForm);
    if (source.id !== null) {
      this.subscribeToSaveResponse(this.sourceService.update(source));
    } else {
      this.subscribeToSaveResponse(this.sourceService.create(source));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISource>>): void {
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

  protected updateForm(source: ISource): void {
    this.source = source;
    this.sourceFormService.resetForm(this.editForm, source);
  }
}
