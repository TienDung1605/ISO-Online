import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICheckLevel } from '../check-level.model';
import { CheckLevelService } from '../service/check-level.service';

@Component({
  standalone: true,
  templateUrl: './check-level-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CheckLevelDeleteDialogComponent {
  checkLevel?: ICheckLevel;

  protected checkLevelService = inject(CheckLevelService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.checkLevelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
