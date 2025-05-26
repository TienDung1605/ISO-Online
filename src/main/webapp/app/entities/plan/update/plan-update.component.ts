import { ChangeDetectorRef, Component, inject, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
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
import { SourceService } from 'app/entities/source/service/source.service';
import { FileUploadModule } from 'primeng/fileupload';
import { NewReport } from 'app/entities/report/report.model';
import { ImageModule } from 'primeng/image';
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

export interface ReportDetail {
  id?: number | null;
  name?: string;
  code?: string;
  sampleReportId?: number | null;
  testOfObject?: string;
  checker?: string;
  status?: string;
  frequency?: string;
  reportType?: string;
  reportTypeId?: number | null;
  createdAt: string;
  updatedAt: string;
  updateBy?: string;
  scoreScale?: string;
  planId?: number | null;
  user?: string;
  detail?: any;
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
    FileUploadModule,
    ImageModule,
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
  detailReport: any = {};
  account: Account | null = null;
  listTitleHeaders: any[] = [];
  listTitleBody: any[] = [];
  listSuggestions: any[] = [];
  headerDefault = [
    { id: null, name: 'Kết quả đánh giá', field: null, data_type: null, source_table: 'Quy đổi', field_name: 'Loại quy đổi', index: 0 },
    { id: null, name: 'Nội dung đánh giá', field: null, data_type: null, source_table: null, field_name: null, index: 0 },
    { id: null, name: 'Hình ảnh đánh giá', field: null, data_type: null, source_table: null, field_name: null, index: 0 },
  ];
  bodyDefault: { header: string; index: number; value: any; type: string }[] = [
    { header: 'Kết quả đánh giá', index: 0, value: '', type: '' },
    { header: 'Nội dung đánh giá', index: 0, value: '', type: 'text' },
    { header: 'Hình ảnh đánh giá', index: 0, value: '', type: 'img' },
  ];
  listReports: NewReport[] = [];
  helpDialogVisible = false;
  selectedIndex: number = 0;
  selectedData: any = null;
  @ViewChild('userTesting') userTesting!: TemplateRef<any>;
  dialogVisible = false;
  dialogUploadVisible = false;
  dialogVisibility: { [key: string]: boolean } = {};
  selectedFiles: { dataKey: string; files: File[] }[] = [];
  imageLoadErrors = new Set<string>();
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
  protected sourceService = inject(SourceService);
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
      });

    this.checkLevelService.getAllCheckLevels().subscribe(res => {
      this.checkLevels = res;
    });

    this.frequencyService.getAllCheckFrequency().subscribe(res => {
      this.listOfFrequency = res;
    });

    this.checkTargetService.getAllCheckTargets().subscribe(res => {
      this.checkTargets = res;
    });

    this.reportTypeService.getAllCheckTargets().subscribe(res => {
      this.reportTypes = res;
    });

    this.sampleReportService.getAllCheckTargets().subscribe(res => {
      this.sampleReport = res;
    });

    this.evaluatorService
      .getAllCheckTargets()
      .pipe(
        switchMap(evaluators => {
          this.evaluator = evaluators;
          evaluators.forEach(e => {});
          return this.checkerGroupService.query();
        }),
      )
      .subscribe({
        next: res => {
          if (res.body) {
          }
        },
        error(error) {},
      });

    this.isCopyMode = history.state.mode === 'COPY' ? true : false;
    this.activatedRoute.data.pipe(take(1)).subscribe(({ plan }) => {
      this.plan = plan;
      if (plan) {
        this.updateForm(plan);
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
  }

  showHelp(): void {
    this.helpDialogVisible = true;
  }

  previousState(): void {
    // window.history.back();
    window.location.href = '/plan';
  }

  loadReports(): void {
    // window.location.reload();
    this.reportService
      .getAllWherePlanIdIsNull()
      .pipe(take(1))
      .subscribe(res => {
        this.listReport = res;
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
      },
    });
    this.cdr.detectChanges();
  }

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
          this.saveChildRecords(savedPlan.id);
        } else {
          this.onSaveSuccess();
        }
      });
    } else {
      // Update mode
      this.planService.update(plan).subscribe(response => {
        const savedPlan = response.body;
        if (savedPlan) {
          this.saveChildRecords(savedPlan.id);
        } else {
          this.onSaveSuccess();
        }
      });
    }
  }

  checkAllData(): void {
    // Raw data for BE

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
    const newRow: NewReport = {
      id: null,
      name: '',
      code: '',
      sampleReportId: null,
      testOfObject: '',
      checker: '',
      status: '',
      frequency: '',
      reportType: '',
      reportTypeId: null,
      createdAt: dayjs(),
      updatedAt: dayjs(),
      updateBy: this.account?.login,
      scoreScale: '',
      planId: null,
      user: '',
      detail: '',
    };
    this.listReports.push(newRow);
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
    const reportId = this.listReports[index].id as unknown as number;
    if (reportId !== null && reportId !== undefined) {
      this.reportService.delete(reportId).subscribe(() => {
        this.listReports.splice(index, 1);
      });
    } else {
      this.listReports.splice(index, 1);
    }
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
  }

  openModalUser(): void {
    this.modalService
      .open(this.userTesting, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        backdrop: 'static',
      })
      .result.then(
        result => {},
        reason => {},
      );
  }

  showDialogEdit(index: number): void {
    this.selectedIndex = index;
    this.dialogVisible = true;
    if (typeof this.listReports[index].detail === 'string') {
      this.listReports[index].detail = JSON.parse(this.listReports[index].detail);
    }
  }

  updateReportCode(data: any, index: number): void {
    const selectedId = +data.target.value;
    this.listReports[index].code = `${this.sampleReport.find(r => r.id === selectedId).code}-${dayjs().format('DDMMYYYYHHmm')}`;
    this.listReports[index].frequency = this.sampleReport.find(r => r.id === selectedId).frequency;
    this.listReports[index].reportType = this.sampleReport.find(r => r.id === selectedId).reportType;
    this.listReports[index].checker = this.evaluator[index].name;
    this.listReports[index].detail = this.sampleReport.find(r => r.id === selectedId).detail;
    this.listTitleBody = JSON.parse(this.listReports[index].detail).body;
    this.listTitleHeaders = JSON.parse(this.listReports[index].detail).header;
    this.headerDefault.forEach(x => {
      x.index = this.listTitleHeaders.length + 1;
      this.listTitleHeaders.push(x);
    });
    this.listTitleBody.forEach(element => {
      this.bodyDefault.forEach(x => {
        x.index = element.data.lenght + 1;
        element.data.push(JSON.parse(JSON.stringify(x)));
      });
    });
    this.listReports[index].detail = {
      header: this.listTitleHeaders,
      body: this.listTitleBody,
    };
  }

  addNewRowBBKT(data: any): void {
    data.detail.body.push({
      data: data.detail.body[0].data.map((x: any) => ({ ...x, value: '' })),
    });
  }

  deleteRowBBKT(index: number, data: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this row?',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      cancelButtonText: `Cancel`,
    }).then(result => {
      if (result.value) {
        this.listReports[this.selectedIndex].detail.body.splice(index, 1);
      }
    });
  }

  showDialogUpLoad(data: any, rowIndex: number, colIndex: number): void {
    const key = `${rowIndex}-${colIndex}`;
    if (data.type === 'img' && !Array.isArray(data.value)) {
      data.value = [];
    }
    this.selectedData = data;
    this.dialogVisibility[key] = !this.dialogVisibility[key];
  }

  onFileSelect(event: any, data: any, index: number): void {
    const files: File[] = Array.from(event.files);
    const dataKey = data.header + '-' + index;
    const existing = this.selectedFiles.find(item => item.dataKey === dataKey);
    if (existing) {
      existing.files = [...existing.files, ...files];
    } else {
      this.selectedFiles.push({ dataKey, files });
    }
    if (!Array.isArray(data.value)) {
      data.value = [];
    }
    const existingNames = new Set(data.value);
    for (const file of files) {
      if (!existingNames.has(file.name)) {
        data.value.push(file.name);
        existingNames.add(file.name);
      }
    }
  }

  deleteFile(filename: string, data: any): void {
    const index = data.value.indexOf(filename);
    if (index > -1) {
      data.value.splice(index, 1);
      this.planService.deleteFile(filename).subscribe(response => {
        console.log('File deleted successfully:', response);
      });
    }
  }

  removeImg(event: any, data: any) {
    const index = data.value.indexOf(event.file.name);
    if (index > -1) {
      data.value.splice(index, 1);
    }
  }

  onClear(data: any): void {
    if (data) {
      data.value = [];
    }
  }

  onImageError(fileName: string) {
    this.imageLoadErrors.add(fileName);
  }

  checkEvent(header: string, selectedIndex: number): void {
    const data = this.listReports[selectedIndex]?.detail?.header.find((element: any) => element.name === header);
    this.sourceService.getListTable().subscribe(tables => {
      this.sourceService.getListColumns().subscribe(columns => {
        const column = columns.find((element: any) => element[2] === data.field_name);
        const table = tables.find(x => x[2] === data.source_table);
        if (data) {
          const body = { field_name: column[1], source_table: table[1] };
          this.sampleReportService.getListSuggestions(body).subscribe((res: any) => {
            this.listSuggestions = res.body;
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No data found',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
    });
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
      return;
    }

    const formValues = {
      id: this.isCopyMode ? null : plan.id,
      code: plan.code,
      name: plan.name,
      subjectOfAssetmentPlan: plan.subjectOfAssetmentPlan,
      frequency: plan.frequency,
      timeStart: plan.timeStart ? dayjs(plan.timeStart).format('YYYY-MM-DDTHH:mm') : null,
      timeEnd: plan.timeEnd ? dayjs(plan.timeEnd).format('YYYY-MM-DDTHH:mm') : null,
      status: plan.status,
    };
    this.reportService.getAllByPlanId(plan.id).subscribe(res => {
      this.listReports = res;
    });
    this.editForm.patchValue(formValues);
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
    const requestSaves: Observable<any>[] = [];
    if (!this.listReports || this.listReports.length === 0) {
      this.onSaveSuccess();
      return;
    }
    this.listReports.forEach((report: any) => {
      report.detail = JSON.stringify(report.detail);
      report.planId = planId.toString();

      const formData = new FormData();
      this.selectedFiles.forEach(fileGroup => {
        fileGroup.files.forEach(file => {
          formData.append('files', file);
        });
      });

      if (report.id === null) {
        const create$ = this.reportService.create(report).pipe(
          finalize(() => {
            this.selectedFiles.forEach(fileGroup => {
              fileGroup.files.forEach(file => {
                this.planService.upLoadFile(file).subscribe();
              });
            });
          }),
        );
        requestSaves.push(create$);
      } else {
        report.createdAt = dayjs(report.createdAt);
        report.updatedAt = dayjs();

        const update$ = this.reportService.update(report).pipe(
          finalize(() => {
            this.selectedFiles.forEach(fileGroup => {
              fileGroup.files.forEach(file => {
                this.planService.upLoadFile(file).subscribe();
              });
            });
          }),
        );
        requestSaves.push(update$);
      }
    });
    forkJoin(requestSaves).subscribe(() => {
      this.onSaveSuccess();
    });
  }
}
