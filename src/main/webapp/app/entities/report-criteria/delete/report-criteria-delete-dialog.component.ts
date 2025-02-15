import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IReportCriteria } from '../report-criteria.model';
import { ReportCriteriaService } from '../service/report-criteria.service';

@Component({
  standalone: true,
  templateUrl: './report-criteria-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ReportCriteriaDeleteDialogComponent {
  reportCriteria?: IReportCriteria;

  protected reportCriteriaService = inject(ReportCriteriaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reportCriteriaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
