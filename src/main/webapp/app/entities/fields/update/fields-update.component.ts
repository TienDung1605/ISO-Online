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
import { SourceService } from 'app/entities/source/service/source.service';
import { ISource } from 'app/entities/source/source.model';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-fields-update',
  templateUrl: './fields-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FieldsUpdateComponent implements OnInit {
  isSaving = false;
  fields: IFields | null = null;
  sources: ISource[] = [];
  field: string[] = [];
  name = '';
  selectedField = '';
  selectedSource = '';
  account: Account | null = null;
  protected fieldsService = inject(FieldsService);
  protected fieldsFormService = inject(FieldsFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sourceService = inject(SourceService);
  protected accountService = inject(AccountService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: FieldsFormGroup = this.fieldsFormService.createFieldsFormGroup();

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.activatedRoute.data.subscribe(({ fields }) => {
      this.fields = fields;
      if (fields) {
        this.updateForm(fields);
      }
    });
    this.loadSources();
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fields = this.fieldsFormService.getFields(this.editForm);
    if (fields.id !== null) {
      fields.updatedAt = dayjs(new Date());
      fields.createBy = this.account?.login;
      this.subscribeToSaveResponse(this.fieldsService.update(fields));
    } else {
      fields.createdAt = dayjs(new Date());
      fields.updatedAt = dayjs(new Date());
      fields.createBy = this.account?.login;
      this.subscribeToSaveResponse(this.fieldsService.create(fields));
    }
  }

  loadSources(): void {
    this.sourceService.query().subscribe(response => {
      if (response.body) {
        this.sources = response.body;
      }
    });
  }

  loadFields(name: string): void {
    this.field = [];
    this.sourceService.getListTable().subscribe(res => {
      const result = res.find(x => x[2] === name);

      this.sourceService.getListColumns().subscribe(response => {
        if (response) {
          response.forEach((field: any) => {
            if (field[3] === result[0]) {
              console.log('check name', field, result);
              this.field.push(field[2]);
            }
          });
        }
      });
    });
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
  protected updateSourceId(): void {
    const result = this.sources.find((s: ISource) => s.name === this.name);
    if (result) {
      this.editForm.patchValue({
        sourceId: result.id,
        source: result.name,
      });
      this.loadFields(result.source!);
    }
    console.log('check name2', this.sources);
  }

  protected updateForm(fields: IFields): void {
    this.fields = fields;
    this.fieldsFormService.resetForm(this.editForm, fields);
    this.sourceService.query().subscribe((res: any) => {
      if (res.body) {
        this.sources = res.body;
        const source = res.body.find((s: ISource) => s.id === this.fields?.sourceId);
        if (source) {
          this.name = source.name;
          this.loadFields(source.source);
          console.log('check form', res.body);
        }
      }
    });
  }
}
