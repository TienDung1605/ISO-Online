import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IReportType } from '../report-type.model';

@Component({
  standalone: true,
  selector: 'jhi-report-type-detail',
  templateUrl: './report-type-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ReportTypeDetailComponent {
  @Input() reportType: IReportType | null = null;

  previousState(): void {
    window.history.back();
  }
}
