import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IFrequency } from '../frequency.model';
import { FrequencyService } from '../service/frequency.service';

@Component({
  standalone: true,
  templateUrl: './frequency-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FrequencyDeleteDialogComponent {
  frequency?: IFrequency;

  protected frequencyService = inject(FrequencyService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.frequencyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
