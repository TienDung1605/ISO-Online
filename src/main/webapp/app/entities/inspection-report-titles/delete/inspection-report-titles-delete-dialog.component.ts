import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IInspectionReportTitles } from '../inspection-report-titles.model';
import { InspectionReportTitlesService } from '../service/inspection-report-titles.service';

@Component({
  standalone: true,
  templateUrl: './inspection-report-titles-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InspectionReportTitlesDeleteDialogComponent {
  inspectionReportTitles?: IInspectionReportTitles;

  protected inspectionReportTitlesService = inject(InspectionReportTitlesService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.inspectionReportTitlesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
