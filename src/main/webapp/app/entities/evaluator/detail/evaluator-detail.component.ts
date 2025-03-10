import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IEvaluator } from '../evaluator.model';
import { CheckerGroupService } from 'app/entities/checker-group/service/checker-group.service';

@Component({
  standalone: true,
  selector: 'jhi-evaluator-detail',
  templateUrl: './evaluator-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EvaluatorDetailComponent implements OnInit {
  @Input() evaluator: IEvaluator | null = null;
  protected checkerGroupService = inject(CheckerGroupService);
  ngOnInit(): void {
    this.checkerGroupService.query().subscribe((res: any) => {
      if (res.body) {
        res.body.forEach((checkerGroup: any) => {
          if (this.evaluator?.userGroupId === checkerGroup.id) {
            this.evaluator!.checkerGroup = checkerGroup.name;
          }
        });
      }
    });
  }
  previousState(): void {
    window.history.back();
  }
}
