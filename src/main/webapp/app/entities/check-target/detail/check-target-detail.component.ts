import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICheckTarget } from '../check-target.model';

@Component({
  standalone: true,
  selector: 'jhi-check-target-detail',
  templateUrl: './check-target-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CheckTargetDetailComponent {
  @Input() checkTarget: ICheckTarget | null = null;

  previousState(): void {
    window.history.back();
  }
}
