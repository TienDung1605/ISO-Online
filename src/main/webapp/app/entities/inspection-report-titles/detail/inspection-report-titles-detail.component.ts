import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IInspectionReportTitles } from '../inspection-report-titles.model';

@Component({
  standalone: true,
  selector: 'jhi-inspection-report-titles-detail',
  templateUrl: './inspection-report-titles-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class InspectionReportTitlesDetailComponent {
  @Input() inspectionReportTitles: IInspectionReportTitles | null = null;

  previousState(): void {
    window.history.back();
  }
}
