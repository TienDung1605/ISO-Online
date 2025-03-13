import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICriteria } from '../criteria.model';
import { CriteriaService } from '../service/criteria.service';
import { CriteriaFormService, CriteriaFormGroup } from './criteria-form.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'jhi-criteria-update',
  templateUrl: './criteria-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CriteriaUpdateComponent implements OnInit {
  isSaving = false;
  criteria: ICriteria | null = null;
  criteriaGroups: any[] = [];
  name = '';

  protected criteriaService = inject(CriteriaService);
  protected criteriaFormService = inject(CriteriaFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CriteriaFormGroup = this.criteriaFormService.createCriteriaFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteria }) => {
      this.criteria = criteria;
      if (criteria) {
        this.updateForm(criteria);
      } else {
        this.editForm.patchValue({
          status: 'ACTIVE',
        });
      }
    });
    this.loadCriateriaGroups();
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const criteria = this.criteriaFormService.getCriteria(this.editForm);
    if (criteria.id !== null) {
      this.subscribeToSaveResponse(this.criteriaService.update(criteria));
    } else {
      this.subscribeToSaveResponse(this.criteriaService.create(criteria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteria>>): void {
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
          title: this.criteria?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
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
          title: this.criteria?.id ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!',
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
  protected loadCriateriaGroups(): void {
    this.criteriaService.getAllCriteriaGroups().subscribe(data => {
      this.criteriaGroups = data;
    });
  }

  protected updateCritetiaGroup(): void {
    const criteriaGroup = this.criteriaGroups.find((s: any) => s.name === this.name);
    if (criteriaGroup) {
      this.editForm.patchValue({ criterialGroupId: criteriaGroup.id });
    } else {
      this.editForm.patchValue({
        criterialGroupId: null,
      });
    }
  }

  protected updateForm(criteria: ICriteria): void {
    this.criteria = criteria;
    this.criteriaFormService.resetForm(this.editForm, criteria);
    this.criteriaService.query().subscribe((res: any) => {
      if (res.body) {
        this.criteriaGroups = res.body;
        const checkerGroup = res.body.find((s: any) => s.id === this.criteria?.criterialGroupId);
        if (checkerGroup) {
          this.name = checkerGroup.name;
          console.log('check form', checkerGroup.name);
        }
      }
    });
  }
}
