import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IParts } from '../parts.model';

@Component({
  standalone: true,
  selector: 'jhi-parts-detail',
  templateUrl: './parts-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PartsDetailComponent {
  @Input() parts: IParts | null = null;

  previousState(): void {
    window.history.back();
  }
}
