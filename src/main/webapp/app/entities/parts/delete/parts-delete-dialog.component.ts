import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IParts } from '../parts.model';
import { PartsService } from '../service/parts.service';

@Component({
  standalone: true,
  templateUrl: './parts-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PartsDeleteDialogComponent {
  parts?: IParts;

  protected partsService = inject(PartsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.partsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
