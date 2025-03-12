import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IFrequency } from '../frequency.model';
import { FrequencyService } from '../service/frequency.service';
import { FrequencyFormService, FrequencyFormGroup } from './frequency-form.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'jhi-frequency-update',
  templateUrl: './frequency-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FrequencyUpdateComponent implements OnInit {
  isSaving = false;
  frequency: IFrequency | null = null;
  account: Account | null = null;
  protected frequencyService = inject(FrequencyService);
  protected frequencyFormService = inject(FrequencyFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: FrequencyFormGroup = this.frequencyFormService.createFrequencyFormGroup();

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.activatedRoute.data.subscribe(({ frequency }) => {
      this.frequency = frequency;
      if (frequency) {
        this.updateForm(frequency);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const frequency = this.frequencyFormService.getFrequency(this.editForm);
    if (frequency.id !== null) {
      frequency.updatedAt = dayjs(new Date());
      frequency.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.frequencyService.update(frequency));
    } else {
      frequency.createdAt = dayjs(new Date());
      frequency.updatedAt = dayjs(new Date());
      frequency.updateBy = this.account?.login;
      this.subscribeToSaveResponse(this.frequencyService.create(frequency));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFrequency>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => {
        Swal.mixin({
          toast: true,
          position: 'top-end',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen(toast) {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: 'success',
          title: this.frequency?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
        });
        this.onSaveSuccess();
      },
      error: () => {
        Swal.mixin({
          toast: true,
          position: 'top-end',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen(toast) {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: 'success',
          title: this.frequency?.id ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!',
        });
        this.onSaveError();
      },
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

  protected updateForm(frequency: IFrequency): void {
    this.frequency = frequency;
    this.frequencyFormService.resetForm(this.editForm, frequency);
  }
}
