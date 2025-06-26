import { ChangeDetectorRef, Component, inject, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { SortByDirective, SortDirective } from 'app/shared/sort';
import { SharedModule, ConfirmationService } from 'primeng/api';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AccountService } from 'app/core/auth/account.service';
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
    ConfirmDialogModule,
  ],
  templateUrl: './plan-group.component.html',
  styleUrls: ['../../shared.component.css'],
  providers: [ConfirmationService],
})
export class PlanGroupComponent implements OnInit {
  @ViewChild('criteria') criteria!: TemplateRef<any>;
  @ViewChild('evaluationResult') evaluationResult!: TemplateRef<any>;
  @ViewChild('inspectionData') inspectionData!: TemplateRef<any>;
  selectAll = false;
  selectedPlan: any = {};
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
  filters = {
    name: '',
    checker: '',
    type: '',
    checkDate: '',
    status: '',
  };
  plantGroupResult: any[] = [];
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  selectedPageSize: number = 10;
  account: any = {};

  constructor(
    protected modalService: NgbModal,
    protected ngZone: NgZone,
    protected planGroupService: PlanGroupService,
    protected activatedRoute: ActivatedRoute,
    protected convertService: ConvertService,
    private planService: PlanService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    // Lấy danh sách các kế hoạch nhóm
    this.activatedRoute.data.subscribe(({ plan }) => {
      this.listPlanGroups = Object.keys(plan)
        .filter(key => !isNaN(+key) && typeof plan[key] === 'object' && plan[key] !== null)
        .map(key => plan[key])
        .sort((a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime());
      this.plantGroupResult = [...this.listPlanGroups];
    });
    // lấy kiểu đánh giá
    this.convertService.query().subscribe((res: any) => {
      this.listEvalReportsBase = res.body;
    });
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
  }

  searchTable(): void {
    if (!this.listPlanGroups) {
      return;
    }
    this.plantGroupResult = this.listPlanGroups.filter(planGr => {
      const checkDate = planGr.checkDate ? new Date(planGr.checkDate).toISOString().split('T')[0] : '';
      const searchCreatedDate = this.filters.checkDate ? new Date(this.filters.checkDate).toISOString().split('T')[0] : '';
      return (
        (!this.filters.name || planGr.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.checker || planGr.checker?.toLowerCase().includes(this.filters.checker.toLowerCase())) &&
        (!this.filters.type || planGr.type?.toLowerCase().includes(this.filters.type.toLowerCase())) &&
        (!this.filters.checkDate || checkDate === searchCreatedDate) &&
        (!this.filters.status || planGr.status?.toString().includes(this.filters.status))
      );
    });
  }

  onSearch(title: keyof typeof this.filters, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters[title] = value;
    this.searchTable();
  }

  onPageSizeChange(event: any): void {
    this.selectedPageSize = event.rows;
    this.first = event.first;
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

  // mở dialog tiêu chí và call các detail từ id kế hoạch nhóm để lấy danh sách tiêu trí
  openModalCriteria(data: any): void {
    this.selectedPlan = data;
    this.loadCriteria(data.id);
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
      case 'Đang thực hiện':
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

  // Lưu đánh giá
  async saveEvalReport() {
    try {
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
      this.selectedPlan.status = 'Đang thực hiện';
      const updateStatusPlanGroup = this.planService.createGroupHistory(this.selectedPlan).toPromise();
      await Promise.all([...uploadPromises, createGroupDetailPromise, updateStatusPlanGroup]);
    } catch (err) {
      console.log(err);
    } finally {
      this.dialogVisible = false;
      this.loadCriteria(this.selectedPlan.id);
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
      this.plantGroupResult.splice(index, 1);
    });
  }

  completeEvalReport(data: any) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn hoành thành bản đánh giá này ?',
      header: 'Hoàn thành đánh giá',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        data.status = 'Đã hoàn thành';
        this.planService.createGroupHistory(data).subscribe(res => {});
      },
      reject: () => {},
    });
  }
}
