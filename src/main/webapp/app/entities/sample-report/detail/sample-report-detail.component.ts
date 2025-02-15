import { Component, Input } from '@angular/core';
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
export class SampleReportDetailComponent {
  @Input() sampleReport: ISampleReport | null = null;

  previousState(): void {
    window.history.back();
  }
}
