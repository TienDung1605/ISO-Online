import { Component, inject, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { PlanGroupService } from '../service/plan-group.service';
import { take } from 'rxjs';
import { ConvertService } from 'app/entities/convert/service/convert.service';
import { FileUploadModule } from 'primeng/fileupload';
import { PlanService } from 'app/entities/plan/service/plan.service';
import Swal from 'sweetalert2';
// import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'jhi-plan-group',
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
  templateUrl: './plan-group.component.html',
  styleUrls: ['../../shared.component.css'],
})
export class PlanGroupComponent {
  @ViewChild('criteria') criteria!: TemplateRef<any>;
  @ViewChild('evaluationResult') evaluationResult!: TemplateRef<any>;
  @ViewChild('inspectionData') inspectionData!: TemplateRef<any>;
  selectAll = false;
  selectedPlanCode: any;
  dialogVisible = false;
  listPlanGroups: any[] = [];
  criterialData: any[] = [];
  planGrDetails: any[] = [];
  planGrEvals: any[] = [];
  listEvalReports: any[] = [];
  listEvalReportsBase: any[] = [];
  selectedCritical: any = {};
  dialogVisibility: { [key: string]: boolean } = {};
  selectedData: any = {};
  imageLoadErrors = new Set<string>();
  selectedFiles: { dataKey: string; files: File[] }[] = [];

  constructor(
    protected modalService: NgbModal,
    protected ngZone: NgZone,
    protected planGroupService: PlanGroupService,
    protected activatedRoute: ActivatedRoute,
    protected convertService: ConvertService,
    private planService: PlanService,
  ) {}

  ngOnInit(): void {
    // Lấy danh sách các kế hoạch nhóm
    this.activatedRoute.data.subscribe(({ plan }) => {
      this.listPlanGroups = Object.keys(plan)
        .filter(key => !isNaN(Number(key)) && typeof plan[key] === 'object' && plan[key] !== null)
        .map(key => plan[key]);
    });
    // lấy kiểu đánh giá
    this.convertService.query().subscribe((res: any) => {
      this.listEvalReportsBase = res.body;
    });
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
  }

  // mở dialog tiêu chí và call các detail từ id kế hoạch nhóm để lấy danh sách tiêu trí
  openModalCriteria(id: number): void {
    this.planGroupService.findAllDetail(id).subscribe(res => {
      this.planGrDetails = res.body;
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

  getRowSpan(groupName: string): number {
    const groupItems = this.criterialData.filter(item => item.criterialGroupName === groupName);
    return groupItems.length;
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
      case 'Đã hoàn thành':
        return 'success';
      case 'Mới tạo':
        return 'danger';
      case 'Chưa hoàn thành':
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
    this.dialogVisible = true;
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

  deletePlanGr(data: any, index: number) {
    this.planGroupService.delete(data.id).subscribe(res => {
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
      this.listPlanGroups.splice(index, 1);
    });
  }
}
