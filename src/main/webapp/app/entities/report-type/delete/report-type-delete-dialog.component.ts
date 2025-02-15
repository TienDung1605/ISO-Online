import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IReportType } from '../report-type.model';
import { ReportTypeService } from '../service/report-type.service';

@Component({
  standalone: true,
  templateUrl: './report-type-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ReportTypeDeleteDialogComponent {
  reportType?: IReportType;

  protected reportTypeService = inject(ReportTypeService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reportTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
