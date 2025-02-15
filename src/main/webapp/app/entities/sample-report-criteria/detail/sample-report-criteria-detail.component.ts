import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ISampleReportCriteria } from '../sample-report-criteria.model';

@Component({
  standalone: true,
  selector: 'jhi-sample-report-criteria-detail',
  templateUrl: './sample-report-criteria-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SampleReportCriteriaDetailComponent {
  @Input() sampleReportCriteria: ISampleReportCriteria | null = null;

  previousState(): void {
    window.history.back();
  }
}
