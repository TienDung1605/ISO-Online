import { ChangeDetectorRef, Component, inject, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { SortByDirective, SortDirective } from 'app/shared/sort';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ReportService } from 'app/entities/report/service/report.service';
import { SampleReportService } from 'app/entities/sample-report/service/sample-report.service';
import { FileUploadModule } from 'primeng/fileupload';
import { PlanService } from '../service/plan.service';
import dayjs from 'dayjs/esm';
import { ConvertService } from 'app/entities/convert/service/convert.service';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import Swal from 'sweetalert2';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckTargetService } from 'app/entities/check-target/service/check-target.service';
import { AccountService } from 'app/core/auth/account.service';

interface GroupReport {
  code: string | null;
  name: string | null;
  planId: number | null;
  checkDate: dayjs.Dayjs | null;
  checker: string | null;
  type: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  createdBy?: string | null;
}

@Component({
  selector: 'jhi-gross-script',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    FormatMediumDatetimePipe,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    NgbModule,
    CheckboxModule,
    CommonModule,
    TagModule,
    DialogModule,
    FileUploadModule,
    CalendarModule,
    DropdownModule,
  ],
  templateUrl: './gross-script.component.html',
  styleUrls: ['./gross-script.component.scss'],
})
export class GrossScriptComponent {
  @ViewChild('criteria') criteria!: TemplateRef<any>;
  @ViewChild('evaluationResult') evaluationResult!: TemplateRef<any>;
  @ViewChild('inspectionData') inspectionData!: TemplateRef<any>;
  @ViewChild('groupReport') groupReport!: TemplateRef<any>;
  selectAll = false;
  plan: any = {};
  testObjects: any[] = [];
  conversions: any[] = [];
  reportStatus: any[] = ['Mới tạo', 'Đang thực hiện', 'Đã hoàn thành', 'Chưa hoàn thành'];
  listEvalReports: any = [];
  listEvalReportsBase: any = [];
  selectedTestObject: any;
  selectedConversion: any;
  selectedStatus: any;
  grossScripts: any[] = [];
  evaluator: any[] = [];
  selectedData: any = null;
  dialogVisible = false;
  disableSaveGroupReport = false;
  dialogVisibility: { [key: string]: boolean } = {};
  selectedFiles: { dataKey: string; files: File[] }[] = [];
  imageLoadErrors = new Set<string>();
  groupReportData: GroupReport = {
    code: null,
    name: null,
    planId: null,
    checkDate: null,
    checker: null,
    type: null,
    createdAt: dayjs(),
    updatedAt: null,
    createdBy: null,
  };
  criterialData: any[] = [];
  planGrDetails: any[] = [];
  planGrEvals: any[] = [];
  selectedCritical: any = {};
  selectedPlan: any = {};
  minSelectableDate!: Date;
  maxSelectableDate!: Date;
  selectedReports: any[] = [];
  originalGrossScripts: any[] = [];
  account: any = {};

  constructor(
    protected modalService: NgbModal,
    protected ngZone: NgZone,
    protected activatedRoute: ActivatedRoute,
    protected reportService: ReportService,
    protected sampleReportService: SampleReportService,
    protected planService: PlanService,
    protected convertService: ConvertService,
    protected evaluatorService: EvaluatorService,
    public router: Router,
    protected planGroupService: PlanGroupService,
    private cdr: ChangeDetectorRef,
    protected checkTargetService: CheckTargetService,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plan }) => {
      this.plan = plan;
      this.reportService.getAllByPlanId(plan.id).subscribe(grossScripts => {
        this.grossScripts = grossScripts.map((s: any) => ({ ...s, detail: JSON.parse(s.detail) }));
        this.originalGrossScripts = [...this.grossScripts];
      });
      this.minSelectableDate = new Date(this.plan.timeStart);
      this.maxSelectableDate = new Date(this.plan.timeEnd);
      this.minSelectableDate.setHours(0, 0, 0, 0);
      this.maxSelectableDate.setHours(23, 59, 59, 999);
    });
    this.sampleReportService.getListSuggestions({ field_name: 'type', source_table: 'jhi_convert' }).subscribe((res: any) => {
      this.conversions = Array.from(new Set(res.body));
    });
    this.convertService.query().subscribe(res => {
      this.listEvalReportsBase = res.body;
    });
    this.evaluatorService.getAllCheckTargets().subscribe(res => {
      this.evaluator = res;
    });
    this.checkTargetService.getAllCheckTargets().subscribe(res => {
      this.testObjects = res;
    });
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.grossScripts.forEach(script => {
      script.merge = this.selectAll;
    });
  }

  filterGrossScripts(): void {
    this.grossScripts = this.originalGrossScripts.filter(script => {
      const matchTestObject = !this.selectedTestObject || script.testOfObject === this.selectedTestObject;
      const matchConversion = !this.selectedConversion || script.convertScore === this.selectedConversion;
      const matchTemplate = !this.selectedStatus || script.status === this.selectedStatus;

      return matchTestObject && matchConversion && matchTemplate;
    });
  }

  resetFilter(): void {
    this.grossScripts = [...this.originalGrossScripts];
    this.selectedTestObject = null;
    this.selectedConversion = null;
    this.selectedStatus = null;
  }

  openModalEvaluation(): void {
    this.modalService
      .open(this.evaluationResult, {
        ariaLabelledBy: 'modal-inspection-data-title',
        size: 'xl',
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

  getSeverity(status: string): any {
    switch (status) {
      case 'Đã kiểm tra':
        return 'success';
      case 'Mới tạo':
        return 'danger';
      case 'Chưa kiểm tra':
        return 'waring';
    }
  }

  showDialogEvaluation(data: any): void {
    this.selectedCritical = data;
    this.planGrEvals = this.planGrDetails.filter(
      item => item.criterialGroupName === data.criterialGroupName && item.criterialName === data.criterialName,
    );
    // Lấy kiểu đánh giá tương ứng với BBKT
    this.planGrEvals.forEach((item: any) => {
      this.listEvalReports = this.planGrEvals.map((report: any) => {
        return this.listEvalReportsBase.filter((item2: any) => item2.type === report.convertScore);
      });
    });
    console.log(this.planGrEvals);

    this.dialogVisible = true;
  }

  // kiểm tra disable nút lưu
  checkGroupSelected(): void {
    this.disableSaveGroupReport = this.selectedReports.length > 0 ? false : true;
  }

  // region
  // xử lý uploda file
  showDialogUpLoad(data: any, rowIndex: number): void {
    data.image = typeof data.image == 'string' ? JSON.parse(data.image) : data.image;
    if (!Array.isArray(data.image)) {
      data.image = [];
    }
    this.selectedData = data;
    this.dialogVisibility[rowIndex] = !this.dialogVisibility[rowIndex];
    this.imageLoadErrors.clear();
    this.cdr.detectChanges();
  }

  onFileSelect(event: any, data: any, index: number): void {
    const files: File[] = Array.from(event.files);
    const dataKey = data.reportCode + '-' + index;
    const existing = this.selectedFiles.find(item => item.dataKey === dataKey);
    if (existing) {
      existing.files = [...existing.files, ...files];
    } else {
      this.selectedFiles.push({ dataKey, files });
    }
    if (!Array.isArray(data.image)) {
      data.image = [];
    }
    const existingNames = new Set(data.image);
    for (const file of files) {
      const safeFileName = this.sanitizeFileName(file.name);
      if (!existingNames.has(safeFileName)) {
        data.image.push(safeFileName);
        existingNames.add(safeFileName);
      }
    }
  }

  deleteFile(filename: string, data: any): void {
    const index = data.image.indexOf(filename);
    if (index > -1) {
      data.image.splice(index, 1);
      this.planService.deleteFile(filename).subscribe(response => {
        console.log('File deleted successfully:', response);
      });
    }
  }

  removeImg(event: any, data: any) {
    const index = data.image.indexOf(event.file.name);
    if (index > -1) {
      data.image.splice(index, 1);
    }
  }

  onClear(data: any): void {
    if (data) {
      data.image = [];
    }
  }

  onImageError(fileName: string) {
    this.imageLoadErrors.add(fileName);
    this.cdr.detectChanges();
  }

  getTimestamp(): number {
    return Date.now();
  }

  sanitizeFileName(filename: string): string {
    return filename
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_\-\.]/g, '');
  }
  // endregion

  generateCode(): string {
    const uid = window.crypto?.randomUUID?.() || this.fallbackUUID();
    return `PG-${this.plan.id}-${uid}`;
  }

  private fallbackUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // eslint-disable-next-line no-bitwise
      const r = (Math.random() * 16) | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Lưu kế hoạch gộp
  saveGroupReport(data: any) {
    // const arrReportGroups = this.grossScripts.filter(s => s.groupReport === 1);
    data.code = this.generateCode();
    data.planId = this.plan.id;
    data.type = this.selectedReports.length > 1 ? 'mutilple' : 'single';
    data.checkDate = dayjs(data.checkDate).toISOString();
    data.createdBy = this.account.login;
    data.status = 'Mới tạo';
    this.selectedPlan = { ...data };
    this.planService.createGroupHistory(data).subscribe(res => {
      this.selectedPlan.id = res.body;
      const result: any[] = [];
      this.selectedReports.forEach(item => {
        const groupNames: string[] = [];
        const criterialNames: string[] = [];
        const frequency: string[] = [];
        item.detail.body.forEach((row: any) => {
          row.data.forEach((cell: any) => {
            if (cell.index === 1) {
              groupNames.push(cell.value);
            }
            if (cell.index === 2) {
              criterialNames.push(cell.value);
            }
          });
          frequency.push(row.frequency);
        });
        for (let i = 0; i < Math.max(groupNames.length, criterialNames.length); i++) {
          result.push({
            createdAt: data.checkDate,
            createdBy: data.createdBy,
            criterialGroupName: groupNames[i] || '',
            criterialName: criterialNames[i] || '',
            frequency: frequency[i] || '',
            planGroupHistoryId: res.body,
            reportId: item.id,
            reportName: item.name,
            hasEvaluation: 1,
            status: 'Mới tạo',
            convertScore: item.convertScore,
          });
        }
      });
      this.groupReportData = {
        code: null,
        name: null,
        planId: null,
        checkDate: null,
        checker: null,
        type: null,
        createdAt: dayjs(),
        updatedAt: null,
        createdBy: null,
      };
      this.planService.createGroupHistoryDetail(result).subscribe({
        next: responsive => {
          Swal.fire({
            title: 'Đã tạo bản ghi thành công bạn có muốn đánh giá luôn?',
            showCancelButton: true,
            confirmButtonText: `Comfirm`,
            cancelButtonText: `Cancel`,
          }).then(result => {
            if (result.value) {
              this.loadCriteria(res.body as number);
              this.modalService
                .open(this.criteria, {
                  ariaLabelledBy: 'modal-criteria-title',
                  size: 'xl',
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
          });
        },
      });
    });
  }

  loadCriteria(id: number): void {
    this.planGroupService.findAllDetail(id).subscribe(res => {
      this.planGrDetails = res.body;
      const groupMap = new Map<string, { criterialGroupName: string; criterialName: string; frequency: any; status: string[] }>();
      for (const item of this.planGrDetails) {
        const key = `${item.criterialGroupName}|${item.criterialName}`;
        if (!groupMap.has(key)) {
          groupMap.set(key, {
            criterialGroupName: item.criterialGroupName,
            criterialName: item.criterialName,
            frequency: item.frequency,
            status: [item.status],
          });
        } else {
          groupMap.get(key)!.status.push(item.status);
        }
      }
      this.criterialData = Array.from(groupMap.values())
        .map(group => ({
          criterialGroupName: group.criterialGroupName,
          criterialName: group.criterialName,
          frequency: group.frequency,
          status: group.status.find(s => s !== 'Mới tạo') || 'Mới tạo',
        }))
        .sort((a, b) => a.criterialGroupName.localeCompare(b.criterialGroupName));
    });
  }

  getRowSpan(groupName: string): number {
    const groupItems = this.criterialData.filter(item => item.criterialGroupName === groupName);
    return groupItems.length;
  }

  openGroupReportModal(): void {
    this.modalService
      .open(this.groupReport, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        backdrop: 'static',
      })
      .result.then(
        result => {
          console.log(`Closed with: ${result}`);
        },
        reason => {},
      );
  }

  navigateToGroupHistory() {
    this.router.navigate(['script']);
  }

  // Lưu đánh giá
  async saveEvalReport() {
    try {
      if (this.selectedPlan.status === 'Mới tạo') {
        this.selectedPlan.status = 'Đang thực hiện';
        this.planService.createGroupHistory(this.selectedPlan).toPromise();
      }
      this.planGrEvals = this.planGrEvals.map(item => {
        return {
          ...item,
          image: JSON.stringify(item.image),
          status: item.result != null || item.hasEvaluation == 0 ? 'Đang thực hiện' : 'Mới tạo',
        };
      });
      const uploadPromises = this.selectedFiles.flatMap(fileGroup =>
        fileGroup.files.map(file => {
          const safeFileName = this.sanitizeFileName(file.name);
          const safeFile = new File([file], safeFileName, { type: file.type });
          return this.planService.upLoadFile(safeFile).toPromise();
        }),
      );
      const createGroupDetailPromise = this.planService.createGroupHistoryDetail(this.planGrEvals).toPromise();
      if (this.plan.status === 'Mới tạo') {
        this.plan.status = 'Đang thực hiện';
        this.planService.update(this.plan).toPromise();
      }
      const updateReportStatus = this.selectedReports
        .filter(item => item.status === 'Mới tạo')
        .map(item => {
          item.detail = typeof item.detail === 'string' ? item.detail : JSON.stringify(item.detail);
          item.status = 'Đang thực hiện';
          item.createdAt = dayjs(item.createdAt);
          item.updatedAt = dayjs();
          return this.reportService.update(item).toPromise();
        });
      await Promise.all([...uploadPromises, createGroupDetailPromise, updateReportStatus]);
    } catch (err) {
      console.log(err);
    } finally {
      this.dialogVisible = false;
      this.loadCriteria(this.selectedPlan.id as number);
    }
  }

  finaEval() {
    this.modalService.dismissAll();
  }
}
