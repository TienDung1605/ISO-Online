import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IConvert } from '../convert.model';

@Component({
  standalone: true,
  selector: 'jhi-convert-detail',
  templateUrl: './convert-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ConvertDetailComponent {
  @Input() convert: IConvert | null = null;

  previousState(): void {
    window.history.back();
  }
}
