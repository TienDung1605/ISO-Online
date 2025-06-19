import { Component, inject, NgZone, TemplateRef, ViewChild } from '@angular/core';
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

interface GroupReport {
  code: string | null;
  name: string | null;
  planId: number | null;
  checkDate: dayjs.Dayjs | null;
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
  ],
  templateUrl: './gross-script.component.html',
  styleUrls: ['../../shared.component.css'],
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
  reportTemplates: any[] = [];
  listEvalReports: any = [];
  listEvalReportsBase: any = [];
  selectedTestObject: any;
  selectedConversion: any;
  selectedTemplate: any;
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
    type: null,
    createdAt: dayjs(),
    updatedAt: null,
    createdBy: null,
  };
  criterialData: any[] = [];
  planGrDetails: any[] = [];
  planGrEvals: any[] = [];
  selectedCritical: any = {};

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
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plan }) => {
      this.plan = plan;
      this.reportService.getAllByPlanId(plan.id).subscribe(grossScripts => {
        this.grossScripts = grossScripts.map((s: any) => ({ ...s, detail: JSON.parse(s.detail) }));
      });
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
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.grossScripts.forEach(script => {
      script.merge = this.selectAll;
    });
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
    this.disableSaveGroupReport = this.grossScripts.some(script => script.groupReport === 1);
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
      if (!existingNames.has(file.name)) {
        data.image.push(file.name);
        existingNames.add(file.name);
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
  }
  // endregion

  generateCode(): string {
    const uid = crypto.randomUUID();
    // const currentDate = dayjs().format('DDMMYYYYHHmmssSSS');
    return `PG-${this.plan.id}-${uid}`;
  }

  // Lưu kế hoạch gộp
  saveGroupReport(data: any) {
    const arrReportGroups = this.grossScripts.filter(s => s.groupReport === 1);
    data.code = this.generateCode();
    data.planId = this.plan.id;
    data.type = arrReportGroups.length > 1 ? 'mutilple' : 'single';
    data.checkDate = dayjs(data.checkDate).toISOString();
    this.planService.createGroupHistory(data).subscribe(res => {
      const result: any[] = [];
      arrReportGroups.forEach(item => {
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
            status: item.status,
            convertScore: item.convertScore,
          });
        }
      });
      this.planService.createGroupHistoryDetail(result).subscribe({
        next: responsive => {
          Swal.fire({
            title: 'Đã tạo bản ghi thành công bạn có muốn đánh giá luôn?',
            showCancelButton: true,
            confirmButtonText: `Comfirm`,
            cancelButtonText: `Cancel`,
          }).then(result => {
            if (result.value) {
              this.planGroupService.findAllDetail(res.body as number).subscribe(response => {
                this.planGrDetails = response.body;
                const seen = new Set<string>();
                this.criterialData = this.planGrDetails
                  .map(item => ({
                    criterialGroupName: item.criterialGroupName,
                    criterialName: item.criterialName,
                    frequency: item.frequency,
                  }))
                  .filter(item => {
                    const key = `${item.criterialGroupName}|${item.criterialName}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                  })
                  .sort((a, b) => a.criterialGroupName.localeCompare(b.criterialGroupName));
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
              });
            }
          });
        },
      });
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
      this.planGrEvals = this.planGrEvals.map(item => {
        return {
          ...item,
          image: JSON.stringify(item.image),
        };
      });
      const uploadPromises: Promise<any>[] = this.selectedFiles.flatMap(fileGroup =>
        fileGroup.files.map(file => this.planService.upLoadFile(file).toPromise()),
      );
      const createGroupDetailPromise = this.planService.createGroupHistoryDetail(this.planGrEvals).toPromise();
      await Promise.all([...uploadPromises, createGroupDetailPromise]);
    } catch (err) {
      console.log(err);
    } finally {
      this.dialogVisible = false;
    }
  }

  finaEval() {
    this.modalService.dismissAll();
  }
}
