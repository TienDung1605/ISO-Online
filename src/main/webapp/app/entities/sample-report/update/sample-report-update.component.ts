import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import SharedModule from 'app/shared/shared.module';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { ISampleReport } from '../sample-report.model';
import { SampleReportService } from '../service/sample-report.service';
import { SampleReportFormService, SampleReportFormGroup } from './sample-report-form.service';

import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ReportTypeService } from 'app/entities/report-type/service/report-type.service';
import { TitleService } from 'app/entities/title/service/title.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import dayjs from 'dayjs/esm';
import { SourceService } from 'app/entities/source/service/source.service';

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
  listReportTypes: any[] = [];
  listTitles: any[] = [];
  listTitlesView: any[] = [];
  listTitleHeaders: any[] = [];
  listTitleBody: any[] = [];
  dataOnChange = false;
  listSuggestions: any[] = [];
  account: Account | null = null;
  protected sampleReportService = inject(SampleReportService);
  protected sampleReportFormService = inject(SampleReportFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected reportTypeService = inject(ReportTypeService);
  protected titleService = inject(TitleService);
  protected accountService = inject(AccountService);
  protected sourceService = inject(SourceService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SampleReportFormGroup = this.sampleReportFormService.createSampleReportFormGroup();

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.reportTypeService.query().subscribe((res: any) => {
      this.listReportTypes = res.body;
    });
    this.titleService.getAllTitles().subscribe((res: any) => {
      res.body.forEach((element: any) => {
        element.index = 0;
      });
      this.listTitles = res.body;
      console.log(this.listTitles);
    });
    this.activatedRoute.data.subscribe(({ sampleReport }) => {
      this.sampleReport = sampleReport;
      if (sampleReport) {
        this.updateForm(sampleReport);
        const data = JSON.parse(sampleReport.detail);
        this.listTitlesView = data.header;
        this.listTitleHeaders = data.header;
        this.listTitleBody = data.body;
        sessionStorage.setItem('listTitlesView', JSON.stringify(data.header));
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
    return this.sampleReportService.checkNameExists(control.value).pipe(
      map(isDuplicate => (isDuplicate ? { duplicate: true } : null)),
      catchError(() => of(null)),
    );
  }

  save(): void {
    this.isSaving = true;
    const sampleReport = this.sampleReportFormService.getSampleReport(this.editForm);
    if (this.editForm.invalid) {
      this.markAllAsTouched();
      this.showValidationError();
      return;
    }
    sampleReport.updateBy = this.account?.login;
    sampleReport.detail = JSON.stringify({ header: this.listTitleHeaders, body: this.listTitleBody });
    sampleReport.updatedAt = dayjs(new Date());
    if (sampleReport.id !== null) {
      this.subscribeToSaveResponse(this.sampleReportService.update(sampleReport));
    } else {
      sampleReport.createdAt = dayjs(new Date());
      this.subscribeToSaveResponse(this.sampleReportService.create(sampleReport));
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

  showDialog(): void {
    this.visible = true;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISampleReport>>): void {
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
          title: this.sampleReport?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
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
          title: this.sampleReport?.id ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!',
        });
        this.onSaveError();
      },
    });
  }

  onReportTypeChange(): void {}
  // ------------------ Title Table ------------------
  onTitlesChange(title: any, index: any): void {
    const result = this.listTitles.find((element: any) => element.name === title);
    if (result) {
      this.listTitlesView[index].id = index;
      this.listTitlesView[index].name = result.name;
      this.listTitlesView[index].field = result.field;
      this.listTitlesView[index].data_type = result.data_type;
      this.listTitlesView[index].source_table = result.source_table;
      this.listTitlesView[index].index = index + 1;
      this.listTitlesView[index].field_name = result.field_name;
    }
    console.log('change title::', this.listTitlesView);
  }
  addNewTitle(): void {
    const data = { id: 0, name: '', index: this.listTitlesView.length + 1, field: '', data_type: '' };
    this.listTitlesView = [...this.listTitlesView, data];
  }
  saveAndSortHeader(): void {
    if (this.dataOnChange === true) {
      Swal.fire({
        title: 'Are you sure you want to save the changes?',
        showCancelButton: true,
        confirmButtonText: `Save`,
        cancelButtonText: `Cancel`,
      }).then(result => {
        if (!result.isConfirmed) {
          const data = sessionStorage.getItem('listTitlesView');
          if (data) {
            this.listTitlesView = this.listTitleHeaders = JSON.parse(data);
            this.dataOnChange = false;
            this.changeIndexBody(this.listTitleHeaders); // change index of body when header change
            this.checkDataChange(); // check body change
          }
        } else {
          sessionStorage.setItem('listTitlesView', JSON.stringify(this.listTitlesView));
          const data = this.listTitlesView.sort((a, b) => a.index - b.index);
          this.listTitleHeaders = data;
          console.log(this.listTitleHeaders);
          this.dataOnChange = false;
          this.changeIndexBody(this.listTitleHeaders); // change index of body when header change
          this.checkDataChange(); // check body change
        }
      });
    } else {
      // save and sort header
      sessionStorage.setItem('listTitlesView', JSON.stringify(this.listTitlesView));
      const data = this.listTitlesView.sort((a, b) => a.index - b.index);
      this.listTitleHeaders = data;
      console.log(this.listTitleHeaders);
      this.dataOnChange = false;
      this.changeIndexBody(this.listTitleHeaders); // change index of body when header change
      this.checkDataChange(); // check body change
    }
  }
  deleteTitle(index: any): void {
    this.dataOnChange = true;
    this.listTitlesView.splice(index, 1);
    this.listTitlesView.forEach((element: any, index: any) => {
      element.index = index + 1;
    });
  }
  checkDataChange(): void {
    this.listTitleBody.forEach((element: any) => {
      console.log('lenght ::', element.data.length, this.listTitleHeaders);
      if (element.data.length < this.listTitleHeaders.length) {
        this.listTitleHeaders.forEach((item: any) => {
          if (!element.data.find((elements: any) => elements.header === item.name)) {
            element.data.push({ header: item.name, index: item.index, value: '' });
            console.log('element::', element);
            this.sortBody(this.listTitleHeaders);
          }
        });
      } else if (element.data.length > this.listTitleHeaders.length) {
        element.data = element.data.filter((item: any) => this.listTitleHeaders.find((element: any) => element.name === item.header));
        this.sortBody(this.listTitleHeaders);
      }
    });
  }
  //---------------------------------------------------
  // --------------------------------------------------- Table Title Body ------------------------------------------
  addNewRow(): void {
    // create body for new row
    var body: any[] = [];
    this.listTitleHeaders.forEach((element: any) => {
      body.push({ header: element.name, index: element.index, value: '' });
    });
    this.listTitleBody = [...this.listTitleBody, { data: body }];
    console.log('body::', this.listTitleBody);
  }
  sortBody(body: any[]): void {
    body.sort((a, b) => a.index - b.index);
  }
  changeIndexBody(header: any[]): void {
    // change index of body when header change
    if (header.length === 0) {
      return;
    } else {
      this.listTitleBody.forEach((element: any) => {
        element.data.forEach((item: any) => {
          header.forEach((headerItem: any) => {
            if (item.header === headerItem.name) {
              item.index = headerItem.index;
              console.log('item::', item);
              this.sortBody(element.data);
            }
          });
        });
      });
    }
  }
  deleteRow(index: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this row?',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      cancelButtonText: `Cancel`,
    }).then(result => {
      if (result.value) {
        this.listTitleBody.splice(index, 1);
      }
    });
  }
  checkEvent(header: string): void {
    console.log('check event', this.listTitleHeaders);
    const data = this.listTitleHeaders.find((element: any) => element.name === header);
    this.sourceService.getListTable().subscribe(tables => {
      this.sourceService.getListColumns().subscribe(columns => {
        const column = columns.find((element: any) => element[2] === data.field_name);
        const table = tables.find(x => x[2] === data.source_table);
        console.log('check column and table :: ', column, table); // column and table
        if (data) {
          console.log('data::', data);
          const body = { field_name: column[1], source_table: table[1] };
          this.sampleReportService.getListSuggestions(body).subscribe((res: any) => {
            this.listSuggestions = res.body;
            console.log('suggestions::', this.listSuggestions);
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No data found',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
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
  // ---------------------------------------------------------------------------------------------
  protected updateForm(sampleReport: ISampleReport): void {
    this.sampleReport = sampleReport;
    this.sampleReportFormService.resetForm(this.editForm, sampleReport);
  }
}
