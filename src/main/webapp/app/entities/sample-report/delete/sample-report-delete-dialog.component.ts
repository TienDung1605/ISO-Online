import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISampleReport } from '../sample-report.model';
import { SampleReportService } from '../service/sample-report.service';

@Component({
  standalone: true,
  templateUrl: './sample-report-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SampleReportDeleteDialogComponent {
  sampleReport?: ISampleReport;

  protected sampleReportService = inject(SampleReportService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sampleReportService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
