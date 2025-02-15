import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IScript } from '../script.model';

@Component({
  standalone: true,
  selector: 'jhi-script-detail',
  templateUrl: './script-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ScriptDetailComponent {
  @Input() script: IScript | null = null;

  previousState(): void {
    window.history.back();
  }
}
