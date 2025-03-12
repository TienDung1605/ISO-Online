import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITitle } from '../title.model';
import { TitleService } from '../service/title.service';
import { TitleFormService, TitleFormGroup } from './title-form.service';
import Swal from 'sweetalert2';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import dayjs from 'dayjs/esm';
import { IFields } from 'app/entities/fields/fields.model';
import { ISource } from 'app/entities/source/source.model';
import { FieldsService } from 'app/entities/fields/service/fields.service';
import { SourceService } from 'app/entities/source/service/source.service';

@Component({
  standalone: true,
  selector: 'jhi-title-update',
  templateUrl: './title-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TitleUpdateComponent implements OnInit {
  isSaving = false;
  title: ITitle | null = null;
  field: IFields[] = [];
  // source: ISource | null = null;
  source: ISource[] = [];
  account: Account | null = null;
  dataTypes: string[] = ['String', 'Number', 'Date', 'Boolean'];

  selectedSource: string = '';
  selectedField: string = '';
  protected titleService = inject(TitleService);
  protected titleFormService = inject(TitleFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  protected fieldsService = inject(FieldsService);
  protected sourceService = inject(SourceService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TitleFormGroup = this.titleFormService.createTitleFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ title }) => {
      this.title = title;
      if (title) {
        this.updateForm(title);
      }
    });
    this.accountService.identity().subscribe(account => {
      this.account = account;

      if (account) {
        this.editForm.patchValue({
          updateBy: account.login,
        });
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const title = this.titleFormService.getTitle(this.editForm);
    if (title.id !== null) {
      title.updatedAt = dayjs(new Date());
      title.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.titleService.update(title));
    } else {
      title.createdAt = dayjs(new Date());
      title.updatedAt = dayjs(new Date());
      title.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.titleService.create(title));
    }
  }

  loadSources(): void {
    this.sourceService.getAllSources().subscribe(data => {
      this.source = data;
    });
  }

  onSourceChange(): void {
    const selectedSource = this.source.find(s => s.name === this.selectedSource);
    if (selectedSource) {
      this.fieldsService.getAllFields().subscribe(data => {
        this.field = data;
      });
      this.editForm.patchValue({ source: this.selectedSource });
    }
  }

  onFieldChange(): void {
    this.editForm.patchValue({ field: this.selectedField });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITitle>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => {
        Swal.mixin({
          toast: true,
          position: 'top-end',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen(toast) {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: 'success',
          title: this.title?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
        });
        this.onSaveSuccess();
      },
      error: () => {
        Swal.mixin({
          toast: true,
          position: 'top-end',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen(toast) {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: 'success',
          title: this.title?.id ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!',
        });
        this.onSaveError();
      },
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

  protected updateForm(title: ITitle): void {
    this.title = title;
    this.titleFormService.resetForm(this.editForm, title);
  }
}
