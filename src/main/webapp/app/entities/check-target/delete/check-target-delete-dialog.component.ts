import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICheckTarget } from '../check-target.model';
import { CheckTargetService } from '../service/check-target.service';

@Component({
  standalone: true,
  templateUrl: './check-target-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CheckTargetDeleteDialogComponent {
  checkTarget?: ICheckTarget;

  protected checkTargetService = inject(CheckTargetService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.checkTargetService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
