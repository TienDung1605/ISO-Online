import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IFields } from '../fields.model';
import { SourceService } from 'app/entities/source/service/source.service';
import { ISource } from 'app/entities/source/source.model';

@Component({
  standalone: true,
  selector: 'jhi-fields-detail',
  templateUrl: './fields-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class FieldsDetailComponent implements OnInit {
  @Input() fields: IFields | null = null;
  source: ISource[] = [];
  protected sourceService = inject(SourceService);
  ngOnInit(): void {
    this.sourceService.query().subscribe((res: any) => {
      if (res.body) {
        res.body.forEach((source: ISource) => {
          if (this.fields?.sourceId === source.id) {
            this.fields.source = source.name;
          }
        });
      }
    });
  }
  previousState(): void {
    window.history.back();
  }
}
