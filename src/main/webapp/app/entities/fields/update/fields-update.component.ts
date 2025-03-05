import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IFields } from '../fields.model';
import { FieldsService } from '../service/fields.service';
import { FieldsFormService, FieldsFormGroup } from './fields-form.service';

@Component({
  standalone: true,
  selector: 'jhi-fields-update',
  templateUrl: './fields-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FieldsUpdateComponent implements OnInit {
  isSaving = false;
  fields: IFields | null = null;

  protected fieldsService = inject(FieldsService);
  protected fieldsFormService = inject(FieldsFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: FieldsFormGroup = this.fieldsFormService.createFieldsFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fields }) => {
      this.fields = fields;
      if (fields) {
        this.updateForm(fields);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fields = this.fieldsFormService.getFields(this.editForm);
    if (fields.id !== null) {
      this.subscribeToSaveResponse(this.fieldsService.update(fields));
    } else {
      this.subscribeToSaveResponse(this.fieldsService.create(fields));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFields>>): void {
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

  protected updateForm(fields: IFields): void {
    this.fields = fields;
    this.fieldsFormService.resetForm(this.editForm, fields);
  }
}
