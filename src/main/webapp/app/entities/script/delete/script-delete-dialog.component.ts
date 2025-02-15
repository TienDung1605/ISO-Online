import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IScript } from '../script.model';
import { ScriptService } from '../service/script.service';

@Component({
  standalone: true,
  templateUrl: './script-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ScriptDeleteDialogComponent {
  script?: IScript;

  protected scriptService = inject(ScriptService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.scriptService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
