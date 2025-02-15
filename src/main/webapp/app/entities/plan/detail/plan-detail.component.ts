import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IPlan } from '../plan.model';

@Component({
  standalone: true,
  selector: 'jhi-plan-detail',
  templateUrl: './plan-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PlanDetailComponent {
  @Input() plan: IPlan | null = null;

  previousState(): void {
    window.history.back();
  }
}
