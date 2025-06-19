import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

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
  field: any[] = [];
  fieldOrigin: any[] = [];
  source: any[] = [];
  sourceTableName: any[] = [];
  account: Account | null = null;

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
    this.sourceService.query().subscribe(data => {
      this.sourceTableName = data.body!;
    });
    this.fieldsService.getAllFields().subscribe((data: any) => {
      this.field = data;
      this.fieldOrigin = data;
      console.log('check data: ', data);
      data.forEach((element: any) => {
        if (this.source.length === 0) {
          const res = { name: element.source };
          this.source.push(res);
        } else {
          const result = this.source.find((x: any) => x.name === element.source);
          if (!result) {
            const res = { name: element.source };
            this.source.push(res);
          }
        }
      });
    });
    this.accountService.identity().subscribe(account => {
      this.account = account;

      if (account) {
        this.editForm.patchValue({
          updateBy: account.login,
        });
      }
    });
    this.editForm.get('name')?.addValidators([Validators.required]);
    this.editForm.get('name')?.setAsyncValidators([this.duplicateNameValidator.bind(this)]);
    this.editForm.get('name')?.updateValueAndValidity();
  }

  previousState(): void {
    window.history.back();
  }

  duplicateNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    if (this.title && this.title.name === control.value) {
      return of(null);
    }
    return this.titleService.checkNameExists(control.value).pipe(
      map(isDuplicate => (isDuplicate ? { duplicate: true } : null)),
      catchError(() => of(null)),
    );
  }

  save(): void {
    this.isSaving = true;
    const title = this.titleFormService.getTitle(this.editForm);
    if (this.editForm.invalid) {
      this.markAllAsTouched();
      this.showValidationError();
      return;
    }
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

  markAllAsTouched(): void {
    Object.values(this.editForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  showValidationError(): void {
    const errors = this.editForm.get('name')?.errors;
    let errorMessage = 'Vui lòng kiểm tra lại thông tin';

    if (errors?.['required']) {
      errorMessage = 'Tên không được để trống';
    } else if (errors?.['duplicate']) {
      errorMessage = 'Tên này đã tồn tại';
    }

    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: errorMessage,
      confirmButtonText: 'OK',
    });
  }

  loadSources(): void {
    this.sourceService.getAllSources().subscribe(data => {
      this.source = data;
    });
  }

  onSourceChange(): void {
    const selectedSource = this.source.find(s => s.name === this.selectedSource);
    const field = this.fieldOrigin.filter(f => f.source === this.selectedSource);
    this.field = field;
    if (selectedSource) {
      this.editForm.patchValue({ source: this.selectedSource });
    }
  }

  onFieldChange(): void {
    this.sourceService.getListTable().subscribe(table => {
      this.sourceService.getListColumns().subscribe(columns => {
        const field_name = columns.find(f => f[2] === this.field.find(x => x.name === this.selectedField)?.field_name);
        console.log('check column::', field_name, columns);
        this.selectedSource = this.field.find(f => f.name === this.selectedField)?.source;
        const table_id = table.find(x => x[2] === this.sourceTableName.find(f => f.name === this.selectedSource)?.source);
        console.log('select table', table_id, this.sourceTableName.find(f => f.name === this.selectedSource)?.source);
        this.fieldsService.getAllFieldInfo(table_id[1]).subscribe(data => {
          const dataType = data.body?.find((x: any) => x[0] === field_name[1]);
          console.log('check log: ', data, field_name);
          if (dataType) {
            this.editForm.patchValue({
              dataType: dataType[1],
            });
          } else {
            this.editForm.patchValue({
              dataType: '',
            });
          }
        });
        this.editForm.patchValue({
          field: this.selectedField,
          source: this.field.find(f => f.name === this.selectedField)?.source,
        });
      });
    });
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
    console.log('check title: ', this.editForm);
    this.selectedField = this.editForm.get('field')!.value!;
    this.selectedSource = this.editForm.get('source')!.value!;
  }
}
