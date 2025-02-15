import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEvaluator } from '../evaluator.model';
import { EvaluatorService } from '../service/evaluator.service';

@Component({
  standalone: true,
  templateUrl: './evaluator-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EvaluatorDeleteDialogComponent {
  evaluator?: IEvaluator;

  protected evaluatorService = inject(EvaluatorService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.evaluatorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
