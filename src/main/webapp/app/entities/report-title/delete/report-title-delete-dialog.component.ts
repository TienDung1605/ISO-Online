import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IReportTitle } from '../report-title.model';
import { ReportTitleService } from '../service/report-title.service';

@Component({
  standalone: true,
  templateUrl: './report-title-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ReportTitleDeleteDialogComponent {
  reportTitle?: IReportTitle;

  protected reportTitleService = inject(ReportTitleService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reportTitleService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
