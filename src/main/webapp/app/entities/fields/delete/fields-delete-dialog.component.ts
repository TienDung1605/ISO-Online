import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IFields } from '../fields.model';
import { FieldsService } from '../service/fields.service';

@Component({
  standalone: true,
  templateUrl: './fields-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FieldsDeleteDialogComponent {
  fields?: IFields;

  protected fieldsService = inject(FieldsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fieldsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
