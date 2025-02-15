import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IReportCriteria } from '../report-criteria.model';

@Component({
  standalone: true,
  selector: 'jhi-report-criteria-detail',
  templateUrl: './report-criteria-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ReportCriteriaDetailComponent {
  @Input() reportCriteria: IReportCriteria | null = null;

  previousState(): void {
    window.history.back();
  }
}
