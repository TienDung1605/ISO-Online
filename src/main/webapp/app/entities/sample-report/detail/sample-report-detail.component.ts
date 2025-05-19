import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ISampleReport } from '../sample-report.model';

@Component({
  standalone: true,
  selector: 'jhi-sample-report-detail',
  templateUrl: './sample-report-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SampleReportDetailComponent implements OnInit {
  @Input() sampleReport: ISampleReport | null = null;
  listTitleHeaders: any[] = [];
  listSuggestions: any[] = [];
  listTitleBody: any[] = [];

  ngOnInit(): void {
    if (this.sampleReport?.detail) {
      const data = JSON.parse(this.sampleReport.detail);
      this.listTitleHeaders = data.header;
      this.listSuggestions = data.body;
      this.listTitleBody = data.body;
    }
  }
  previousState(): void {
    window.history.back();
  }
}
