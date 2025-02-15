import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICheckLevel } from '../check-level.model';

@Component({
  standalone: true,
  selector: 'jhi-check-level-detail',
  templateUrl: './check-level-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CheckLevelDetailComponent {
  @Input() checkLevel: ICheckLevel | null = null;

  previousState(): void {
    window.history.back();
  }
}
