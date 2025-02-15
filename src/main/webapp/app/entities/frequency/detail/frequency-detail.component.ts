import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IFrequency } from '../frequency.model';

@Component({
  standalone: true,
  selector: 'jhi-frequency-detail',
  templateUrl: './frequency-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class FrequencyDetailComponent {
  @Input() frequency: IFrequency | null = null;

  previousState(): void {
    window.history.back();
  }
}
