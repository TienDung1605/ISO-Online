import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IConvert } from '../convert.model';
import { ConvertService } from '../service/convert.service';
import { ConvertFormService, ConvertFormGroup } from './convert-form.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-convert-update',
  templateUrl: './convert-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ConvertUpdateComponent implements OnInit {
  isSaving = false;
  convert: IConvert | null = null;
  account: Account | null = null;
  protected convertService = inject(ConvertService);
  protected convertFormService = inject(ConvertFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ConvertFormGroup = this.convertFormService.createConvertFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ convert }) => {
      this.convert = convert;
      if (convert) {
        this.updateForm(convert);
      }
    });
    this.accountService.identity().subscribe(account => {
      this.account = account;

      if (account) {
        this.editForm.patchValue({
          updateBy: account.login,
        });
      }
    });

    this.activatedRoute.data.subscribe(({ convert }) => {
      this.convert = convert;
      if (convert) {
        this.updateForm(convert);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const convert = this.convertFormService.getConvert(this.editForm);
    if (convert.id !== null) {
      convert.updatedAt = dayjs(new Date());
      convert.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.convertService.update(convert));
    } else {
      convert.createdAt = dayjs(new Date());
      convert.updatedAt = dayjs(new Date());
      convert.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.convertService.create(convert));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConvert>>): void {
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

  protected updateForm(convert: IConvert): void {
    this.convert = convert;
    this.convertFormService.resetForm(this.editForm, convert);
  }
}
