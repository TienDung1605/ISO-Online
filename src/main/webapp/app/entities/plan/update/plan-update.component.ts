import { Component, inject, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { IPlan } from '../plan.model';
import { PlanService } from '../service/plan.service';
import { PlanFormService, PlanFormGroup } from './plan-form.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'jhi-plan-update',
  templateUrl: './plan-update.component.html',
  styleUrls: ['../../shared.component.css'],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    NgbModule,
    MultiSelectModule,
    DropdownModule,
    // BrowserAnimationsModule,
    // BrowserModule,
    // SelectModule
  ],
})
export class PlanUpdateComponent implements OnInit {
  isSaving = false;
  isEditMode = false;
  plan: IPlan | null = null;
  cities: any[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];

  selectedCities: any[] = [];
  planDetailResults: any[] = [];

  emptyRow = {
    checkerName: '',
    code: '',
    createBy: '',
    frequency: '',
    implementer: '',
    name: '',
    nameResult: '',
    numberOfCheck: '',
    paticipant: '',
  };

  @ViewChild('userTesting') userTesting!: TemplateRef<any>;

  protected planService = inject(PlanService);
  protected planFormService = inject(PlanFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PlanFormGroup = this.planFormService.createPlanFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plan }) => {
      this.plan = plan;
      if (plan) {
        this.isEditMode = true;
        this.plan = plan;
        this.updateForm(plan);
      } else {
        this.isEditMode = false;
        this.editForm = this.planFormService.createPlanFormGroup();
      }
    });
    this.planService.getPlanDetail().subscribe(res => {
      this.planDetailResults = res;
      console.log('db trả về', res);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const plan = this.planFormService.getPlan(this.editForm);
    if (plan.id !== null) {
      this.subscribeToSaveResponse(this.planService.update(plan));
    } else {
      this.subscribeToSaveResponse(this.planService.create(plan));
    }
  }

  addNewRow(): void {
    const newRow = { ...this.emptyRow };
    this.planDetailResults = [...this.planDetailResults, newRow];
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Thêm mới thành công',
    });
  }

  deleteRow(index: number): void {
    this.planDetailResults = this.planDetailResults.filter((_, i) => i !== index);
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Xóa thành công',
    });
    console.log('Row deleted at index:', index);
  }

  openModalUser(): void {
    this.modalService
      .open(this.userTesting, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'sm',
        backdrop: 'static',
      })
      .result.then(
        result => {
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
        },
      );
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlan>>): void {
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

  protected updateForm(plan: IPlan): void {
    this.plan = plan;
    this.planFormService.resetForm(this.editForm, plan);
  }
}
