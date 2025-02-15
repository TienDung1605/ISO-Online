import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITitle } from '../title.model';
import { TitleService } from '../service/title.service';

@Component({
  standalone: true,
  templateUrl: './title-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TitleDeleteDialogComponent {
  title?: ITitle;

  protected titleService = inject(TitleService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.titleService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
