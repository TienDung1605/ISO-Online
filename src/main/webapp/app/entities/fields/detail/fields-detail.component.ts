import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IFields } from '../fields.model';

@Component({
  standalone: true,
  selector: 'jhi-fields-detail',
  templateUrl: './fields-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class FieldsDetailComponent {
  @Input() fields: IFields | null = null;

  previousState(): void {
    window.history.back();
  }
}
