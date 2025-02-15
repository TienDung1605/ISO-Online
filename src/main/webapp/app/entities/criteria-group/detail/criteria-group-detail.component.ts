import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICriteriaGroup } from '../criteria-group.model';

@Component({
  standalone: true,
  selector: 'jhi-criteria-group-detail',
  templateUrl: './criteria-group-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CriteriaGroupDetailComponent {
  @Input() criteriaGroup: ICriteriaGroup | null = null;

  previousState(): void {
    window.history.back();
  }
}
