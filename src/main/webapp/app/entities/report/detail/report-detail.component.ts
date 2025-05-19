import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IReport } from '../report.model';
import { ReportFormGroup, ReportFormService } from '../update/report-form.service';
import { SampleReportService } from 'app/entities/sample-report/service/sample-report.service';

@Component({
  standalone: true,
  selector: 'jhi-report-detail',
  templateUrl: './report-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ReportDetailComponent {
  @Input() report: IReport | null = null;
  listTitleHeaders: any[] = [];
  listTitleBody: any[] = [];
  sampleReport: string = '';
  sampleReports: any[] = [];
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
  protected activatedRoute = inject(ActivatedRoute);
  protected reportFormService = inject(ReportFormService);
  protected sampleReportService = inject(SampleReportService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReportFormGroup = this.reportFormService.createReportFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ report }) => {
      this.report = report;
      if (report) {
        this.updateForm(report);
        const data = JSON.parse(report.detail);
        this.listTitleHeaders = data.header;
        this.listTitleBody = data.body;
        console.log('header', this.listTitleHeaders);
        console.log('body', this.listTitleBody);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  updateSampleReportId(): void {
    const sampleReport = this.sampleReports.find(x => x[1] === this.sampleReport);
    this.editForm.patchValue({
      sampleReportId: sampleReport[0],
    });
    console.log('check sample report::', this.editForm);
    this.getSampleReportDetail();
  }
  getSampleReportDetail(): void {
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

  protected updateForm(report: IReport): void {
    this.report = report;
    this.reportFormService.resetForm(this.editForm, report);
  }
}
