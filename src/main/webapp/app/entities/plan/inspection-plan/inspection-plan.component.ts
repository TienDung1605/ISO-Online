import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { SortByDirective, SortDirective } from 'app/shared/sort';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { GalleriaModule } from 'primeng/galleria';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { FrequencyService } from 'app/entities/frequency/service/frequency.service';
import { CheckTargetService } from 'app/entities/check-target/service/check-target.service';
import { take } from 'rxjs';
import { PlanService } from '../service/plan.service';
import { ReportService } from 'app/entities/report/service/report.service';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import dayjs from 'dayjs/esm';
import { RemediationPlanService } from '../service/remediationPlan.service';
import Swal from 'sweetalert2';
import { TagModule } from 'primeng/tag';

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
  ],
  templateUrl: './inspection-plan.component.html',
  styleUrl: './inspection-plan.component.scss',
})
export class InspectionPlanComponent implements OnInit {
  plan: any = {};
  listReportCriterialErrors: any[] = [];
  listRemediationPlan: any[] = [];
  processedReportData: any[] = [];
  dialogUpdateRemePlan: boolean = false;
  dialogRepairCriterial: boolean = false;
  dialogCheckCriterial: boolean = false;
  groupCriterialError: any = {};
  remediationPlanSelected: any = {};
  evaluator: any[] = [];
  selectedRows: any[] = [];
  listCriterialRepair: any[] = [];
  selectedFiles: { dataKey: string; files: File[] }[] = [];
  imageLoadErrors = new Set<string>();
  selectedData: any = null;
  dialogVisibility: { [key: string]: boolean } = {};
  criterialSelected: any = {};
  listReCheckRemediationPlan: any[] = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    private planService: PlanService,
    private evaluatorService: EvaluatorService,
    private remediationPlanService: RemediationPlanService,
  ) {}

  ngOnInit(): void {
    this.evaluatorService.getAllCheckTargets().subscribe(res => {
      this.evaluator = res;
    });
    this.activatedRoute.data.pipe(take(1)).subscribe(({ plan }) => {
      this.plan = plan;
      // Gọi tât cả các dữ liệu đánh giá của các bbkt có trong plan
      this.planService.getAllPlanGroupHistoryDetailsByPlanId(plan.id).subscribe(res => {
        this.listReportCriterialErrors = res.body.filter(
          (item: any) => item.result == 'NC' || item.result == 'LY' || item.result == 'Không đạt',
        );
        this.groupAndProcessData();
      });
      // get dữ liệu table kế hoạch khắc phục
      this.reloadRemediationTableData(plan.id);
    });
    if (!this.groupCriterialError.repairDate) {
      const today = new Date();
      this.groupCriterialError.repairDate = today.toISOString().substring(0, 10);
    }
  }

  // region
  // format dữ liệu hiển thị
  groupAndProcessData(): void {
    const groupedData: { [key: string]: any } = {};
    this.listReportCriterialErrors.forEach(item => {
      const key = `${item.reportId}-${item.reportName}-${item.criterialGroupName}-${item.criterialName}-${item.convertScore}-${item.result}-${item.frequency}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          reportId: item.reportId,
          reportName: item.reportName,
          criterialGroupName: item.criterialGroupName,
          criterialName: item.criterialName,
          convertScore: item.convertScore,
          result: item.result,
          frequency: item.frequency,
          createdDates: [],
          rowspan: 0,
        };
      }
      groupedData[key].createdDates.push(item.createdAt);
    });
    this.processedReportData = Object.values(groupedData).map(row => {
      row.rowspan = row.createdDates.length;
      row.createdDates.sort((a: any, b: any) => new Date(a).getTime() - new Date(b).getTime());
      return row;
    });
    this.processedReportData.sort((a, b) => {
      if (a.reportId !== b.reportId) {
        return a.reportId - b.reportId;
      }
      if (a.reportName !== b.reportName) {
        return a.reportName.localeCompare(b.reportName);
      }
      return 0;
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // EndRegion

  onCreatedByChange(newCreatedBy: string) {
    this.groupCriterialError.createdBy = newCreatedBy;
    for (let row of this.processedReportData) {
      if (!row.userHandle || row.userHandle.trim() === '') {
        row.userHandle = newCreatedBy;
      }
    }
  }

  reloadRemediationTableData(id: number) {
    this.remediationPlanService.getListByPlanId(id).subscribe(res => {
      this.listRemediationPlan = res.body || [];
    });
  }

  LoadlistCriterialRepairTable(id: number) {
    this.remediationPlanService.getAllRemediationPlanDetailById(id).subscribe(res => {
      this.listCriterialRepair = res.body;
    });
  }

  generateCode(): string {
    const uid = crypto.randomUUID();
    // const currentDate = dayjs().format('DDMMYYYYHHmmssSSS');
    return `RP-${this.plan.id}-${uid}`;
  }

  saveRemediationPlan(data: any) {
    data.code = this.generateCode();
    data.planId = this.plan.id;
    data.repairDate = dayjs(data.repairDate).toISOString();
    data.createdAt = dayjs();
    data.type = 'Multiple';
    data.status = 'Đang xử lý';
    const arrSubmit = this.selectedRows.map(item => {
      return {
        criterialGroupName: item.criterialGroupName,
        criterialName: item.criterialName,
        convertScore: item.convertScore,
        note: item.note,
        solution: item.solution,
        planTimeComplete: dayjs(item.planTimeComplete).toISOString(),
        userHandle: item.userHandle,
        createdAt: dayjs(),
        createdBy: data.createdBy,
        detail: this.listReportCriterialErrors.filter(
          rpt =>
            rpt.criterialGroupName == item.criterialGroupName &&
            rpt.criterialName == item.criterialName &&
            rpt.convertScore == item.convertScore &&
            rpt.reportId == item.reportId &&
            rpt.reportName == item.reportName &&
            rpt.result == item.result,
        ),
      };
    });
    this.remediationPlanService.create(data).subscribe(res => {
      const arrCriterialErr = arrSubmit.map((item: any) => {
        return {
          ...item,
          remediationPlanId: res.body,
          detail: JSON.stringify(item.detail),
        };
      });
      this.remediationPlanService.createRemediationPlanDetail(arrCriterialErr).subscribe(repo => {
        this.reloadRemediationTableData(this.plan.id);
        this.groupCriterialError = {};
        this.selectedRows = [];
        this.dialogUpdateRemePlan = false;
      });
    });
  }

  showDialogListCriterialRepair(data: any) {
    this.remediationPlanSelected = data;
    this.LoadlistCriterialRepairTable(data.id);
    this.dialogRepairCriterial = true;
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

  async saveRemediationPlanDetail(data: any[]) {
    const arrSubmit = data.map(item => {
      return {
        remediationPlanDetailId: item.id,
        result: item.result,
        image: JSON.stringify(item.image),
        reason: item.reason,
        note: item.content,
        createdBy: item.createdBy,
        createdAt: dayjs(),
      };
    });
    await this.remediationPlanService.createRecheckRemePlan(arrSubmit).toPromise();
    await Promise.all(this.selectedFiles.flatMap(fileGroup => fileGroup.files.map(file => this.planService.upLoadFile(file).toPromise())));
    this.dialogRepairCriterial = false;
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
        this.selectedFiles.flatMap(fileGroup => fileGroup.files.map(file => this.planService.upLoadFile(file).toPromise())),
      );
      this.dialogCheckCriterial = false;
      this.LoadlistCriterialRepairTable(this.remediationPlanSelected.id);
    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
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
      this.reloadRemediationTableData(this.plan.id);
    });
  }

  completePlanRepair(data: any) {
    data.status = 'Đã hoàn thành';
    this.remediationPlanService.create(data).subscribe(res => {
      this.reloadRemediationTableData(this.plan.id);
    });
  }
}
