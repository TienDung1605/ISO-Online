import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { SortByDirective, SortDirective } from 'app/shared/sort';
import dayjs from 'dayjs/esm';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { GalleriaModule } from 'primeng/galleria';
import { take } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import { RemediationPlanService } from '../service/remediationPlan.service';
import { PlanService } from '../service/plan.service';
import { FileUploadModule } from 'primeng/fileupload';
import { ConvertService } from 'app/entities/convert/service/convert.service';
import Swal from 'sweetalert2';
import { TagModule } from 'primeng/tag';
import { CheckTargetService } from 'app/entities/check-target/service/check-target.service';
import { CheckerGroupService } from 'app/entities/checker-group/service/checker-group.service';
import { ExportExcelService } from '../service/export-excel.service';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';

@Component({
  selector: 'jhi-inspection-report',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    FormatMediumDatetimePipe,
    TreeTableModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    NgbModule,
    GalleriaModule,
    DialogModule,
    FileUploadModule,
    TagModule,
    HasAnyAuthorityDirective,
  ],
  templateUrl: './inspection-report.component.html',
  styleUrl: './inspection-report.component.scss',
})
export class InspectionReportComponent implements OnInit {
  @ViewChild('listcriterials') listcriterials!: TemplateRef<any>;
  report: any = {};
  listEvalReports: any[] = [];
  listImgReports: any[] = [];
  listCriterialError: any[] = [];
  days = Array.from({ length: 31 }, (_, i) => i + 1);
  months: string[] = [];
  groupedRows: any[] = [];
  rows: any[] = [];
  pivotedRows: any[] = [];
  dialogViewCriterial: boolean = false;
  dialogViewImage: boolean = false;
  dialogRepairCriterial: boolean = false;
  dialogCheckCriterial: boolean = false;
  dialogUpdateRemePlan: boolean = false;
  selectedCritical: any = {};
  criterialDetails: any[] = [];
  groupCriterialError: any = {};
  evaluator: any[] = [];
  selectedCriterialError: any[] = [];
  listRemediationPlan: any[] = [];
  listCriterialRepair: any[] = [];
  listReCheckRemediationPlan: any[] = [];
  listResultEvalReports: any[] = [];
  listEvalReportBase: any = [];
  criterialSelected: any = {};
  selectedFiles: { dataKey: string; files: File[] }[] = [];
  imageLoadErrors = new Set<string>();
  selectedData: any = null;
  dialogVisibility: { [key: string]: boolean } = {};
  remediationPlanSelected: any = {};
  selectedlistCriterialError: any[] = [];
  completeRemeDialog: boolean = false;
  completeRemePlan: any[] = [];
  selectedRecheckCriterial: any[] = [];
  remediationPlanInfo: any = {};

  constructor(
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute,
    private planGrService: PlanGroupService,
    protected evaluatorService: EvaluatorService,
    private remediationPlanService: RemediationPlanService,
    private planService: PlanService,
    private convertService: ConvertService,
    private exportExcelService: ExportExcelService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.evaluatorService.getAllCheckTargets().subscribe(res => {
      this.evaluator = res;
    });
    this.convertService.query().subscribe(res => {
      this.listEvalReportBase = res.body;
    });
    if (!this.groupCriterialError.repairDate) {
      const today = new Date();
      this.groupCriterialError.repairDate = today.toISOString().substring(0, 10);
    }
    this.activatedRoute.data.pipe(take(1)).subscribe(({ report }) => {
      this.report = report;
      this.reloadRemediationTableData(report.id);
      this.planGrService.findAllDetailByReportId(report.id).subscribe(res => {
        this.listEvalReports = (res.body || [])
          .filter(item => item.result)
          .sort((a, b) => {
            const dateA = dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss');
            const dateB = dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss');
            return !dateA.isValid() ? 1 : !dateB.isValid() ? -1 : dateA.valueOf() - dateB.valueOf();
          })
          .map(item => ({
            ...item,
            createdAt:
              typeof item.createdAt?.format === 'function'
                ? item.createdAt.format('DD/MM/YYYY HH:mm:ss')
                : dayjs(item.createdAt, 'DD/MM/YYYY HH:mm:ss').isValid()
                  ? dayjs(item.createdAt, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss')
                  : String(item.createdAt),
          }));
        const grouped: { [criterialKey: string]: { [key: string]: any } } = {};
        const monthsSet: Set<string> = new Set();
        this.pivotedRows = this.listEvalReports.map(item => {
          const createdAt = dayjs(item.createdAt, 'DD/MM/YYYY HH:mm:ss');
          const month = createdAt.format('MM/YYYY');
          const day = createdAt.date();
          monthsSet.add(month);
          const key = `${item.criterialGroupName}_${item.criterialName}_${item.frequency}`;
          grouped[key] = grouped[key] || {
            criterialGroupName: item.criterialGroupName,
            criterialName: item.criterialName,
            frequency: item.frequency,
            monthData: {},
          };
          if (!grouped[key].monthData[month]) {
            grouped[key].monthData[month] = {};
          }
          if (!grouped[key].monthData[month][`day${day}`]) {
            grouped[key].monthData[month][`day${day}`] = [];
          }
          grouped[key].monthData[month][`day${day}`].push(item.result);
          return null;
        });

        this.pivotedRows = Object.values(grouped).sort((a, b) => a.criterialName.localeCompare(b.criterialName));
        this.listCriterialError = this.listEvalReports.filter(
          item => item.result === 'NC' || item.result === 'LY' || item.result === 'Không đạt',
        );
        this.listCriterialError.sort((a, b) => {
          return (
            a.criterialGroupName.localeCompare(b.criterialGroupName) ||
            a.criterialName.localeCompare(b.criterialName) ||
            a.result.localeCompare(b.result)
          );
        });
        this.listCriterialError = this.groupCriterialErrors(this.listCriterialError);
        this.groupedRows = this.pivotedRows;
        this.months = Array.from(monthsSet).sort((a, b) => {
          const [mA, yA] = a.split('/').map(Number);
          const [mB, yB] = b.split('/').map(Number);
          return yA === yB ? mA - mB : yA - yB;
        });
        this.days = Array.from({ length: 31 }, (_, i) => i + 1);
      });
    });
  }

  groupCriterialErrors(data: any[]): any[] {
    const map = new Map<string, any>();
    for (const item of data) {
      const key = `${item.criterialGroupName}|${item.criterialName}|${item.result}|${item.frequency}`;
      if (!map.has(key)) {
        map.set(key, {
          criterialGroupName: item.criterialGroupName,
          criterialName: item.criterialName,
          result: item.result,
          frequency: item.frequency,
          detail: [],
        });
      }
      map.get(key)!.detail.push(item);
    }
    return Array.from(map.values());
  }

  onCreatedByChange(newCreatedBy: string) {
    this.groupCriterialError.createdBy = newCreatedBy;
    for (let row of this.listCriterialError) {
      if (!row.userHandle || row.userHandle.trim() === '') {
        row.userHandle = newCreatedBy;
      }
    }
  }

  viewCriterialDetail(data: any) {
    this.planGrService.findAllPlanGrByReportId(this.report.id).subscribe(res => {
      const arrPlanGr = res.body || [];
      this.criterialDetails = this.listEvalReports.filter(item => item.criterialName === data.criterialName);
      this.selectedCritical.criterialGroupName = this.criterialDetails[0].criterialGroupName;
      this.selectedCritical.criterialName = this.criterialDetails[0].criterialName;
      this.criterialDetails = this.criterialDetails.map(detail => {
        const group = arrPlanGr.find(g => g.id === detail.planGroupHistoryId);
        return {
          ...detail,
          planGroup: group || null,
        };
      });
      this.dialogViewCriterial = true;
    });
  }

  showDialogViewImg(data: any) {
    this.listImgReports = JSON.parse(data);
    this.dialogViewImage = true;
  }

  reloadRemediationTableData(id: number) {
    this.remediationPlanService.getListByReportId(id).subscribe(res => {
      this.listRemediationPlan = res.body || [];
    });
  }

  LoadlistCriterialRepairTable(id: number) {
    this.remediationPlanService.getAllRemediationPlanDetailById(id).subscribe(res => {
      this.listCriterialRepair = res.body;
    });
  }

  generateCode(): string {
    const uid = window.crypto?.randomUUID?.() || this.fallbackUUID();
    return `RP-${this.report.id}-${uid}`;
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

  saveRemediationPlan(data: any) {
    data.code = this.generateCode();
    data.reportId = this.report.id;
    data.repairDate = dayjs(data.repairDate).toISOString();
    data.createdAt = dayjs();
    data.type = 'Single';
    data.status = 'Đang xử lý';
    this.remediationPlanService.create(data).subscribe(res => {
      const arrCriterialErr = this.selectedlistCriterialError.map((item: any) => {
        delete item.result;
        return {
          ...item,
          remediationPlanId: res.body,
          convertScore: item.detail[0].convertScore,
          detail: JSON.stringify(item.detail),
          planTimeComplete: dayjs(item.planTimeComplete).toISOString(),
          createdAt: dayjs(),
          createdBy: data.createdBy,
          note: item.description,
          status: 'Đang xử lý',
        };
      });
      this.remediationPlanService.createRemediationPlanDetail(arrCriterialErr).subscribe(repo => {
        this.reloadRemediationTableData(this.report.id);
        this.groupCriterialError = {};
        this.selectedCriterialError = [];
        this.dialogUpdateRemePlan = false;
      });
    });
  }

  deletePlanRepair(data: any) {
    this.remediationPlanService.deleteRemePlan(data.id).subscribe(res => {
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
        title: 'Xóa thành công',
      });
      this.reloadRemediationTableData(this.report.id);
    });
  }

  showDialogListCriterialRepair(data: any) {
    this.remediationPlanSelected = data;
    this.LoadlistCriterialRepairTable(data.id);
    this.dialogRepairCriterial = true;
  }

  showDialogCheckCriterial(data: any) {
    this.criterialSelected = data;
    this.remediationPlanService.getAllRecheckByRemeDetailId(data.id).subscribe(res => {
      this.listReCheckRemediationPlan = res.body;
      if (this.listReCheckRemediationPlan.length == 0) {
        this.listReCheckRemediationPlan.push({ status: 'Hoàn thành' });
      } else {
        this.listReCheckRemediationPlan = this.listReCheckRemediationPlan.map(item => {
          return { ...item, image: JSON.parse(item.image) };
        });
      }
    });
    this.dialogCheckCriterial = true;
  }

  addRowListReCheck() {
    this.listReCheckRemediationPlan.push({
      result: this.criterialSelected.convertScore === 'Tính điểm' ? 'PASS' : 'Đạt',
      status: 'Hoàn thành',
    });
  }

  deleteRow(arr: any[], index: number) {
    if (arr[index]?.id) {
      this.remediationPlanService.deleteRecheckReme(arr[index]?.id).subscribe();
    }
    arr.splice(index, 1);
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

  async saveReCheckRemePlan() {
    const arrGroup = this.listCriterialRepair.filter(
      item =>
        item.criterialGroupName === this.criterialSelected.criterialGroupName &&
        item.criterialName === this.criterialSelected.criterialName &&
        item.solution === this.criterialSelected.solution &&
        item.note === this.criterialSelected.note &&
        item.planTimeComplete === this.criterialSelected.planTimeComplete,
    );
    const result: any[] = [];
    this.listReCheckRemediationPlan.forEach(item => {
      arrGroup.forEach(ref => {
        result.push({
          ...item,
          remediationPlanDetailId: ref.id,
          image: JSON.stringify(item.image),
          createdAt: dayjs(),
          createdBy: this.criterialSelected.createdBy,
        });
      });
    });
    try {
      await this.remediationPlanService.createRemediationPlanDetail([this.criterialSelected]).toPromise();
      await this.remediationPlanService.createRecheckRemePlan(result).toPromise();
      await Promise.all(
        this.selectedFiles.flatMap(fileGroup =>
          fileGroup.files.map(file => {
            const safeFileName = this.sanitizeFileName(file.name);
            const safeFile = new File([file], safeFileName, { type: file.type });
            return this.planService.upLoadFile(safeFile).toPromise();
          }),
        ),
      );
      this.dialogCheckCriterial = false;
      this.LoadlistCriterialRepairTable(this.remediationPlanSelected.id);
    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
  }

  checkEvent(data: any) {
    this.listResultEvalReports = this.listEvalReportBase.filter((item: any) => item.type === data.convertScore);
  }

  async saveRemediationPlanDetail(data: any[]) {
    const arrSubmit = data
      .filter(item => item.result != null)
      .map(item => {
        return {
          remediationPlanDetailId: item.id,
          result: item.result,
          image: JSON.stringify(item.image),
          reason: item.reason,
          note: item.content,
          status: item.status,
          createdBy: item.createdBy,
          createdAt: dayjs(),
        };
      });
    await this.remediationPlanService.createRecheckRemePlan(arrSubmit).toPromise();
    await Promise.all(
      this.selectedFiles.flatMap(fileGroup =>
        fileGroup.files.map(file => {
          const safeFileName = this.sanitizeFileName(file.name);
          const safeFile = new File([file], safeFileName, { type: file.type });
          return this.planService.upLoadFile(safeFile).toPromise();
        }),
      ),
    );
    this.dialogRepairCriterial = false;
  }

  showDialogComplete(data: any) {
    this.remediationPlanInfo = data;
    this.remediationPlanService.getRemediationPlanWithFullDetails(data.id).subscribe(res => {
      this.completeRemePlan = res.body.details || [];
      this.completeRemeDialog = true;
    });
  }

  completePlanRepair() {
    // console.log(this.selectedRecheckCriterial);
    if (this.selectedRecheckCriterial.length === 0) {
      return;
    }
    const updateRequests: any[] = this.selectedRecheckCriterial.map(cpl => {
      const { detail, ...rest } = cpl;
      return {
        ...rest,
        status: 'Đã hoàn thành',
        repairDate: dayjs(cpl.repairDate).toISOString(),
      };
    });
    console.log(updateRequests);
    this.remediationPlanService.createRemediationPlanDetail(updateRequests).subscribe(repo => {
      this.selectedRecheckCriterial.forEach(selectedCpl => {
        const index = this.completeRemePlan.findIndex(cpl => cpl.id === selectedCpl.id);
        if (index !== -1) {
          this.completeRemePlan[index].status = 'Đã hoàn thành';
        }
      });
      this.selectedRecheckCriterial = [];
      this.checkAndUpdateParentRemediationPlanStatus();
      this.completeRemeDialog = false;
    });
  }

  checkAndUpdateParentRemediationPlanStatus(): void {
    if (!this.remediationPlanInfo || !this.completeRemePlan || this.completeRemePlan.length === 0) {
      return;
    }
    const pendingDetails = this.completeRemePlan.filter(cpl => cpl.status !== 'Đã hoàn thành');
    if (pendingDetails.length === 0) {
      this.remediationPlanInfo.status = 'Đã hoàn thành';
      this.remediationPlanService.create(this.remediationPlanInfo).subscribe(res => {
        this.reloadRemediationTableData(this.report.id);
      });
    }
  }

  exportToExcel() {
    this.exportExcelService.exportToExcel(this.report.id);
  }
}
