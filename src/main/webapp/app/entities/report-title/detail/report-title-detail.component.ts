import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IReportTitle } from '../report-title.model';

@Component({
  standalone: true,
  selector: 'jhi-report-title-detail',
  templateUrl: './report-title-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ReportTitleDetailComponent {
  @Input() reportTitle: IReportTitle | null = null;

  previousState(): void {
    window.history.back();
  }
}
