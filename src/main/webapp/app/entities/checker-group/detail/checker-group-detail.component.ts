import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICheckerGroup } from '../checker-group.model';

@Component({
  standalone: true,
  selector: 'jhi-checker-group-detail',
  templateUrl: './checker-group-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CheckerGroupDetailComponent {
  @Input() checkerGroup: ICheckerGroup | null = null;

  previousState(): void {
    window.history.back();
  }
}
