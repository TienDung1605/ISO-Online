import { ChangeDetectorRef, Component, inject, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

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
import { ReportService } from 'app/entities/report/service/report.service';
import dayjs from 'dayjs/esm';
import { DialogModule } from 'primeng/dialog';
import { take } from 'rxjs/operators';
import { CheckLevelService } from 'app/entities/check-level/service/check-level.service';
import { FrequencyService } from 'app/entities/frequency/service/frequency.service';
import { CheckTargetService } from 'app/entities/check-target/service/check-target.service';
import { ReportTypeService } from 'app/entities/report-type/service/report-type.service';
import { SampleReportService } from 'app/entities/sample-report/service/sample-report.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import { IEvaluator } from 'app/entities/evaluator/evaluator.model';
import { CheckerGroupService } from 'app/entities/checker-group/service/checker-group.service';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';

interface PlanDetail {
  id?: number | null;
  checkerName: string;
  code: string;
  createBy: string;
  frequency: string;
  implementer: string;
  name: string;
  nameResult: string;
  numberOfCheck: string;
  paticipant: string;
  planId?: number;
}

interface UserGroup {
  id: number;
  userGroupId: number;
  name: string;
}

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
    DialogModule,
    // BrowserAnimationsModule,
    // BrowserModule,
    // SelectModule
  ],
})
export class PlanUpdateComponent implements OnInit {
  mode: 'NEW' | 'EDIT' | 'COPY' = 'NEW';
  selectedGroupId: number | null = null;
  isSaving = false;
  isEditMode = false;
  copiedPlan = false;
  isCopyMode = false;
  plan: IPlan | null = null;
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
  filteredUserGroups: any[] = [];
  listReport: any[] = []; // list report where dont have plan
  listReportDetail: any[] = []; // list report detail where in current plan
  checkLevels: any[] = [];
  listOfFrequency: any[] = [];
  checkTargets: any[] = [];
  reportTypes: any[] = [];
  sampleReport: any[] = [];
  evaluator: any[] = [];
  userNameGroups: any[] = [];
  evaluators?: IEvaluator[];
  account: Account | null = null;
  helpDialogVisible = false;
  @ViewChild('userTesting') userTesting!: TemplateRef<any>;
  dialogVisible = false;
  protected planService = inject(PlanService);
  protected planFormService = inject(PlanFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  protected accountService = inject(AccountService);
  protected reportService = inject(ReportService);
  protected cdr = inject(ChangeDetectorRef);
  protected checkLevelService = inject(CheckLevelService);
  protected frequencyService = inject(FrequencyService);
  protected checkTargetService = inject(CheckTargetService);
  protected reportTypeService = inject(ReportTypeService);
  protected sampleReportService = inject(SampleReportService);
  protected evaluatorService = inject(EvaluatorService);
  protected checkerGroupService = inject(CheckerGroupService);
  // editForm: any = this.planFormService.createPlanFormGroup();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PlanFormGroup = this.planFormService.createPlanFormGroup();

  constructor() {
    window.addEventListener('keydown', event => {
      if (event.key === 'F1') {
        event.preventDefault();
        this.showHelp();
      }
    });
  }

  ngOnInit(): void {
    this.reportService
      .getAllWherePlanIdIsNull()
      .pipe(take(1))
      .subscribe(res => {
        this.listReport = res ? [...res] : [];
        // this.cdr.detectChanges();
        console.log('listReport:', this.listReport);
      });

    this.checkLevelService.getAllCheckLevels().subscribe(res => {
      this.checkLevels = res;
      console.log('checkLevels:', this.checkLevels);
    });

    this.frequencyService.getAllCheckFrequency().subscribe(res => {
      this.listOfFrequency = res;
      console.log('listOfFrequency:', this.listOfFrequency);
    });

    this.checkTargetService.getAllCheckTargets().subscribe(res => {
      this.checkTargets = res;
      console.log('checkTargets:', this.checkTargets);
    });

    this.reportTypeService.getAllCheckTargets().subscribe(res => {
      this.reportTypes = res;
      console.log('reportTypes:', this.reportTypes);
    });

    this.sampleReportService.getAllCheckTargets().subscribe(res => {
      this.sampleReport = res;
      console.log('sampleReport:', this.sampleReport);
    });

    this.evaluatorService
      .getAllCheckTargets()
      .pipe(
        switchMap(evaluators => {
          this.evaluator = evaluators;
          console.log('Total evaluators:', evaluators.length);
          console.log('list evaluators:', evaluators);

          evaluators.forEach(e => {
            console.log(`Evaluator ID: ${e.id}, UserGroup ID: ${e.userGroupId}`);
          });
          return this.checkerGroupService.query();
        }),
      )
      .subscribe({
        next: res => {
          if (res.body) {
            this.userNameGroups = [];
            // res.body.forEach(g => {
            //   console.log(`Group ID: ${g.id}, Name: ${g.name}`);
            // });
            // this.userNameGroups = res.body.map(group => ({
            //   id: group.id,
            //   userGroupId: evaluator.userGroupId,
            //   name: group.name
            // }));
            // console.log('Mapped Groups:', this.userNameGroups);
            // this.userNameGroups = this.userNameGroups.filter(group =>
            //   this.evaluator.some(e => e.userGroupId === group.id)
            // );
            this.userNameGroups = [];
            // this.evaluator.forEach(evaluator => {
            //   const checkerGroup = res.body!.find(item => item.id === evaluator.userGroupId);
            //   if (checkerGroup?.name && !this.userNameGroups.includes(checkerGroup.name)) {
            //     this.userNameGroups.push(checkerGroup.name);
            //     console.log('user group id:', evaluator.userGroupId);
            //     console.log('name:', checkerGroup.name);
            //     console.log(`Mapped: Evaluator ${evaluator.id} -> Group ${checkerGroup.id} (${checkerGroup.name})`);
            //   }
            // });
            this.evaluator.forEach(evaluator => {
              const checkerGroup = res.body!.find(item => item.id === evaluator.userGroupId);
              if (checkerGroup?.name) {
                const group: UserGroup = {
                  id: checkerGroup.id,
                  userGroupId: evaluator.userGroupId,
                  name: checkerGroup.name,
                };
                if (!this.userNameGroups.some(g => g.userGroupId === group.userGroupId)) {
                  this.userNameGroups.push(group);
                }
              }
            });
            console.log('Updated userNameGroups:', this.userNameGroups);
          }
        },
        error(error) {
          console.error('Error loading user groups:', error);
        },
      });

    this.activatedRoute.data.pipe(take(1)).subscribe(({ plan }) => {
      this.plan = plan;
      const state = history.state;
      // console.log('Current state:', state);
      // console.log('Original plan:', plan);
      if (plan?.id) {
        this.reportService
          .getAllByPlanId(plan.id)
          .pipe(take(1))
          .subscribe(res => {
            this.planDetailResults = res ? [...res] : [];
            this.cdr.detectChanges();
            console.log('planDetailResults:', this.planDetailResults);
          });
      }

      this.accountService.identity().subscribe(account => {
        this.account = account;

        if (account) {
          this.editForm.patchValue({
            updateBy: account.login,
          });
        }
      });
      // this.updateForm(plan);

      if (plan) {
        if (state?.mode === 'COPY') {
          console.log('COPY');
          this.mode = 'COPY';
          this.isEditMode = true;
          this.isCopyMode = false;
          this.updateForm(plan);

          if (plan.id) {
            this.reportService
              .getAllByPlanId(plan.id)
              .pipe(take(1))
              .subscribe(res => {
                this.planDetailResults = [...res];
                this.cdr.detectChanges();
              });
            console.log('planDetailResults:', this.planDetailResults);
          }
        } else {
          console.log('EDIT');
          this.mode = 'EDIT';
          this.isEditMode = true;
          this.isCopyMode = false;
          this.updateForm(plan);

          if (plan.id) {
            this.reportService
              .getAllByPlanId(plan.id)
              .pipe(take(1))
              .subscribe(res => {
                this.planDetailResults = [...res];
                this.cdr.detectChanges();
              });
          }
        }
      } else {
        console.log('NEW');
        this.mode = 'NEW';
        this.isEditMode = false;
        this.isCopyMode = false;
      }
    });

    this.editForm.get('name')?.valueChanges.subscribe(name => {
      if (name) {
        const code = this.generateCode(name);
        this.editForm.patchValue({ code }, { emitEvent: false });
      }
    });
  }

  onGroupSelect(groupId: number): void {
    this.selectedGroupId = groupId;
    console.log(
      'Selected group:',
      this.userNameGroups.find(g => g.id === groupId),
    );
  }

  showHelp(): void {
    this.helpDialogVisible = true;
  }

  previousState(): void {
    window.history.back();
  }

  loadReports(): void {
    // window.location.reload();
    this.reportService
      .getAllWherePlanIdIsNull()
      .pipe(take(1))
      .subscribe(res => {
        this.listReport = res;
        console.log('check report list :: ', res);
      });
  }

  loadPlanDetails(planId: number, isCopy: boolean): void {
    this.reportService.getAllByPlanId(planId).subscribe({
      next: details => {
        if (isCopy) {
          // For copy mode, reset IDs
          this.planDetailResults = details.map(
            (detail: PlanDetail): PlanDetail => ({
              ...detail,
              id: null,
              planId: undefined,
            }),
          );
        } else {
          this.planDetailResults = details;
        }
        console.log('Loaded plan details:', this.planDetailResults);
      },
      error: err => console.error('Error loading plan details:', err),
    });
    this.cdr.detectChanges();
  }

  // save(): void {
  //   this.isSaving = true;
  //   const plan = this.planFormService.getPlan(this.editForm);
  //   if (plan.id !== null) {
  //     this.subscribeToSaveResponse(this.planService.update(plan));
  //   } else {
  //     this.subscribeToSaveResponse(this.planService.create(plan));
  //   }
  // }

  save(): void {
    this.isSaving = true;
    const plan = this.planFormService.getPlan(this.editForm);

    if (plan.id === null || this.mode === 'COPY') {
      // Create mode
      const newPlan = { ...plan, id: null };
      plan.updatedAt = dayjs(new Date());
      plan.updateBy = this.account?.login;
      this.planService.create(newPlan).subscribe(response => {
        const savedPlan = response.body;
        plan.updatedAt = dayjs(new Date());
        plan.updateBy = this.account?.login;
        if (savedPlan) {
          // Save child records
          // this.saveChildRecords(savedPlan.id);
        }
      });
    } else {
      // Update mode
      this.planService.update(plan).subscribe(response => {
        const savedPlan = response.body;
        if (savedPlan) {
          // Save child records
          // this.saveChildRecords(savedPlan.id);
        }
      });
    }
  }

  checkAllData(): void {
    // Raw data for BE
    console.log('Du lieu gui ve BE:', this.planDetailResults);

    // Formatted data with names
    const formattedData = this.planDetailResults.map((row, index) => ({
      checkLevel: this.checkLevels.find(x => x.id === row.checkLevelId)?.name,
      checkTarget: this.checkTargets.find(x => x.id === row.checkTargetId)?.name,
      reportType: this.reportTypes.find(x => x.id === row.reportTypeId)?.name,
      sampleReport: this.sampleReport.find(x => x.id === row.sampleReportId)?.name,
      code: row.code,
      testOfObject: row.testOfObject,
      frequency: this.listOfFrequency[index].id,
      scoreScale: row.scoreScale,
    }));

    console.log('Dinh dang du lieu:', formattedData);
  }
  generateCode(name: string): string {
    const currentDate = dayjs().format('DDMMYYYYHHmm');
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    return `${initials}-${currentDate}`;
  }

  addNewRow(): void {
    const newRow = { ...this.emptyRow };
    this.planDetailResults.push(newRow);
    console.log('check');
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen(toast) {
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
      didOpen(toast) {
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
        size: 'lg',
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

  showDialogEdit(): void {
    this.dialogVisible = true;
  }

  generateReportCode(detail: any): string {
    const level = this.checkLevels.find(x => x.id === detail.checkLevelId)?.name || '';
    const target = this.checkTargets.find(x => x.id === detail.checkTargetId)?.name || '';
    const type = this.reportTypes.find(x => x.id === detail.reportTypeId)?.name || '';
    const sample = this.sampleReport.find(x => x.id === detail.sampleReportId)?.name || '';
    const code = [type, sample].filter(Boolean).join('-');
    console.log('generateReportCode input:', detail);
    console.log('generateReportCode output:', code);
    return code;
  }

  updateReportCode(index: number): void {
    const detail = this.planDetailResults[index];
    console.log('updateReportCode before:', detail);
    detail.code = this.generateReportCode(detail);
    console.log('updateReportCode after:', detail.code);
    console.log('reportTypeId:', detail.reportTypeId, 'sampleReportId:', detail.sampleReportId);
    console.log('reportTypes:', this.reportTypes);
    console.log('sampleReport:', this.sampleReport);
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
    if (!plan) {
      console.log('No plan provided to updateForm');
      return;
    }

    const formValues = {
      id: plan.id,
      code: plan.code,
      name: plan.name,
      subjectOfAssetmentPlan: plan.subjectOfAssetmentPlan,
      frequency: plan.frequency,
      timeStart: plan.timeStart ? dayjs(plan.timeStart).format('YYYY-MM-DDTHH:mm') : null,
      timeEnd: plan.timeEnd ? dayjs(plan.timeEnd).format('YYYY-MM-DDTHH:mm') : null,
      status: plan.status,
    };

    this.editForm.patchValue(formValues);
    console.log('Setting form values:', formValues);
  }

  protected generateNewCode(name: string): string {
    const currentDate = dayjs().format('DDMMYYYYHHmm');
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    return `COPY-${initials}-${currentDate}`;
  }

  protected saveChildRecords(planId: number): void {
    // Update planId in child records
    const updatedDetails: PlanDetail[] = this.planDetailResults.map((detail: PlanDetail) => ({
      ...detail,
      planId,
    }));

    // Save child records
    this.reportService.saveDetails(updatedDetails).subscribe(() => {
      this.onSaveSuccess();
    });
  }
}
