import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ITitle } from '../title.model';

@Component({
  standalone: true,
  selector: 'jhi-title-detail',
  templateUrl: './title-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TitleDetailComponent {
  @Input() title: ITitle | null = null;

  previousState(): void {
    window.history.back();
  }
}
