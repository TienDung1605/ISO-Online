import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IParts } from '../parts.model';
import { PartsService } from '../service/parts.service';
import { PartsFormService, PartsFormGroup } from './parts-form.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-parts-update',
  templateUrl: './parts-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PartsUpdateComponent implements OnInit {
  isSaving = false;
  parts: IParts | null = null;
  account: Account | null = null;
  protected partsService = inject(PartsService);
  protected partsFormService = inject(PartsFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PartsFormGroup = this.partsFormService.createPartsFormGroup();

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.activatedRoute.data.subscribe(({ parts }) => {
      this.parts = parts;
      if (parts) {
        this.updateForm(parts);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parts = this.partsFormService.getParts(this.editForm);
    if (parts.id !== null) {
      parts.updatedAt = dayjs(new Date());
      parts.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.partsService.update(parts));
    } else {
      parts.createdAt = dayjs(new Date());
      parts.updatedAt = dayjs(new Date());
      parts.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.partsService.create(parts));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParts>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(parts: IParts): void {
    this.parts = parts;
    this.partsFormService.resetForm(this.editForm, parts);
  }
}
