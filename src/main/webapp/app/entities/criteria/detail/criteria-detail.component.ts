import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICriteria } from '../criteria.model';
import { CriteriaGroupService } from 'app/entities/criteria-group/service/criteria-group.service';

@Component({
  standalone: true,
  selector: 'jhi-criteria-detail',
  templateUrl: './criteria-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CriteriaDetailComponent implements OnInit {
  @Input() criteria: ICriteria | null = null;
  protected criterialGroupService = inject(CriteriaGroupService);
  ngOnInit(): void {
    this.criterialGroupService.query().subscribe((res: any) => {
      if (res.body) {
        const criterialGroup = res.body.find((criterialGroup: any) => criterialGroup.id === this.criteria?.criterialGroupId);
        if (criterialGroup) {
          this.criteria!.criterialGroup = criterialGroup.name;
        }
      }
    });
  }
  previousState(): void {
    window.history.back();
  }
}
