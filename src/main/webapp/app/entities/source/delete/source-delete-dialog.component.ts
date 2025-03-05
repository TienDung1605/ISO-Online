import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISource } from '../source.model';
import { SourceService } from '../service/source.service';

@Component({
  standalone: true,
  templateUrl: './source-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SourceDeleteDialogComponent {
  source?: ISource;

  protected sourceService = inject(SourceService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sourceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
