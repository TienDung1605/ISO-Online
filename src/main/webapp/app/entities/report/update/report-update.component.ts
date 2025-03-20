import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IReport } from '../report.model';
import { ReportService } from '../service/report.service';
import { ReportFormService, ReportFormGroup } from './report-form.service';
import { SampleReportService } from 'app/entities/sample-report/service/sample-report.service';
import { SourceService } from 'app/entities/source/service/source.service';
import { FieldsService } from 'app/entities/fields/service/fields.service';
import dayjs from 'dayjs/esm';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'jhi-report-update',
  templateUrl: './report-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReportUpdateComponent implements OnInit {
  isSaving = false;
  report: IReport | null = null;
  // chuẩn bị thông tin kết quả
  headerDefault = [
    { id: null, name: 'Kết quả đánh giá', field: null, data_type: null, source_table: null, field_name: null, index: 0 },
    { id: null, name: 'Nội dung đánh giá', field: null, data_type: null, source_table: null, field_name: null, index: 0 },
    { id: null, name: 'Hình ảnh đánh giá', field: null, data_type: null, source_table: null, field_name: null, index: 0 },
  ];
  bodyDefault = [
    { header: 'Kết quả đánh giá', index: 0, value: '' },
    { header: 'Nội dung đánh giá', index: 0, value: '' },
    { header: 'Hình ảnh đánh giá', index: 0, value: '' },
  ];
  sampleReports: any[] = [];
  sampleReport: string = '';
  listTitleHeaders: any[] = []; // list of headers and source, table information
  listTitleBody: any[] = []; // list of body and source, table information
  account: Account | null = null;
  listSuggestions: any[] = [];
  protected reportService = inject(ReportService);
  protected reportFormService = inject(ReportFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sampleReportService = inject(SampleReportService);
  protected sourceService = inject(SourceService);
  protected fieldsService = inject(FieldsService);
  protected accountService = inject(AccountService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReportFormGroup = this.reportFormService.createReportFormGroup();

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.sampleReportService.getListSampleReports().subscribe(result => {
      this.sampleReports = result.body;
      console.log('check report code :: ', this.sampleReports);
    });
    this.activatedRoute.data.subscribe(({ report }) => {
      this.report = report;
      if (report) {
        this.updateForm(report);
        const data = JSON.parse(report.detail);
        this.listTitleHeaders = data.header;
        this.listTitleBody = data.body;
        console.log(this.listTitleBody);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const report = this.reportFormService.getReport(this.editForm);
    report.updateBy = this.account?.login;
    report.detail = JSON.stringify({ header: this.listTitleHeaders, body: this.listTitleBody });
    report.updatedAt = dayjs(new Date());
    if (report.id !== null) {
      this.subscribeToSaveResponse(this.reportService.update(report));
    } else {
      report.createdAt = dayjs(new Date());

      this.subscribeToSaveResponse(this.reportService.create(report));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReport>>): void {
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

  protected updateForm(report: IReport): void {
    this.report = report;
    this.reportFormService.resetForm(this.editForm, report);
  }
  //------------------------------------  sample report -------------------------
  updateSampleReportId() {
    const sampleReport = this.sampleReports.find(x => x[1] === this.sampleReport);
    this.editForm.patchValue({
      sampleReportId: sampleReport[0],
    });
    console.log('check sample report::', this.editForm);
    this.getSampleReportDetail();
  }
  getSampleReportDetail() {
    this.sampleReportService.getSampleReportDetail(this.sampleReport).subscribe(detail => {
      this.listTitleBody = detail.body.body;
      this.listTitleHeaders = detail.body.header;
      console.log('detail::', detail);
      this.headerDefault.forEach(x => {
        x.index = this.listTitleHeaders.length + 1;
        this.listTitleHeaders.push(x);
      });
      this.listTitleBody.forEach(element => {
        this.bodyDefault.forEach(x => {
          x.index = element.data.lenght + 1;
          element.data.push(x);
        });
      });
    });
  }
  addNewRow(): void {
    // create body for new row
    var body: any[] = [];
    this.listTitleHeaders.forEach((element: any) => {
      body.push({ header: element.name, index: element.index, value: '' });
    });
    this.listTitleBody = [...this.listTitleBody, { data: body }];
    console.log('body::', this.listTitleBody);
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
}
