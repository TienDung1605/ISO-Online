import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IEvaluator } from '../evaluator.model';

@Component({
  standalone: true,
  selector: 'jhi-evaluator-detail',
  templateUrl: './evaluator-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EvaluatorDetailComponent {
  @Input() evaluator: IEvaluator | null = null;

  previousState(): void {
    window.history.back();
  }
}
