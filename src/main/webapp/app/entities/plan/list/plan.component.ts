import { Component, NgZone, inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeNode } from 'primeng/api'; // Import TreeNode
import Swal from 'sweetalert2';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IPlan } from '../plan.model';
import { EntityArrayResponseType, PlanService } from '../service/plan.service';
import { PlanDeleteDialogComponent } from '../delete/plan-delete-dialog.component';
import { TreeTableModule } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { SummarizePlanComponent } from 'app/entities/summarize-plan/summarize-plan.component';
import { TagModule } from 'primeng/tag';
import { ReportService } from 'app/entities/report/service/report.service';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import { ConvertService } from 'app/entities/convert/service/convert.service';
import { FileUploadModule } from 'primeng/fileupload';
import dayjs from 'dayjs/esm';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpResponse } from '@angular/common/http';
import { ExportExcelService } from '../service/export-excel.service';

interface CheckPlanDetail {
  id: number;
  score: number;
  reportName: string;
  checkDate: string;
  nc: number;
  ly: number;
  notPass: number;
}

interface CriteriaSummary {
  id: number;
  criteriaGroup: string;
  criteriaName: string;
  conclusion: string;
  evaluationContent: string;
  evaluationImage: string;
  status: 'Đạt' | 'Không đạt' | 'Chờ đánh giá';
}

@Component({
  standalone: true,
  selector: 'jhi-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['../../shared.component.css'],
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
    DialogModule,
    TagModule,
    FileUploadModule,
  ],
  providers: [SummarizePlanComponent],
})
export class PlanComponent implements OnInit {
  subscription: Subscription | null = null;
  plans?: IPlan[];
  isLoading = false;
  treeNodes!: TreeNode[];
  columnDefinitions?: IPlan[];
  sortState = sortStateSignal({});
  files?: TreeNode[];
  expandedRows: { [key: string]: boolean } = {};
  @ViewChild('dt2') dt2!: any;
  planDetailResults: any[] = [];
  sampleReportName: any[] = [];
  planParent: any = {};
  checkLevels: any[] = [];
  listOfFrequency: any[] = [];
  checkTargets: any[] = [];
  reportTypes: any[] = [];
  sampleReport: any[] = [];
  // userTesting: any;
  @ViewChild('userTesting') userTesting!: TemplateRef<any>;
  @ViewChild('gross') gross!: TemplateRef<any>;
  @ViewChild('criteria') criteria!: TemplateRef<any>;
  @ViewChild('evaluationResult') evaluationResult!: TemplateRef<any>;
  @ViewChild('inspectionData') inspectionData!: TemplateRef<any>;
  @ViewChild('detailInspectionData') detailInspectionData!: TemplateRef<any>;
  @ViewChild('criteriaConclusion') criteriaConclusion!: TemplateRef<any>;
  @ViewChild('evaluationPlan') evaluationPlan!: TemplateRef<any>;
  protected reportService = inject(ReportService);
  planData = [
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5,
      orders: [
        {
          id: '1000-0',
          productCode: 'f230fh0g3',
          date: '2020-09-13',
          amount: 65,
          quantity: 1,
          customer: 'David James',
          status: 'PENDING',
        },
        {
          id: '1000-1',
          productCode: 'f230fh0g3',
          date: '2020-05-14',
          amount: 130,
          quantity: 2,
          customer: 'Leon Rodrigues',
          status: 'DELIVERED',
        },
        {
          id: '1000-2',
          productCode: 'f230fh0g3',
          date: '2019-01-04',
          amount: 65,
          quantity: 1,
          customer: 'Juan Alejandro',
          status: 'RETURNED',
        },
        {
          id: '1000-3',
          productCode: 'f230fh0g3',
          date: '2020-09-13',
          amount: 195,
          quantity: 3,
          customer: 'Claire Morrow',
          status: 'CANCELLED',
        },
      ],
    },
  ];

  planDetails = [
    {
      id: 1,
      level: 'Cấp 1',
      checkTarget: 'Đối tượng 1',
      reportType: 'Loại 1',
      reportTemplate: 'Mẫu 1',
      reportCode: 'BBKT001',
      reportGroup: 'Nhóm 1',
      frequency: 'Hàng ngày',
      scoreScale: '10',
    },
    {
      id: 2,
      level: 'Cấp 2',
      checkTarget: 'Đối tượng 2',
      reportType: 'Loại 2',
      reportTemplate: 'Mẫu 2',
      reportCode: 'BBKT002',
      reportGroup: 'Nhóm 2',
      frequency: 'Hàng tuần',
      scoreScale: '10',
    },
    {
      id: 3,
      level: 'Cấp 2',
      checkTarget: 'Đối tượng 3',
      reportType: 'Loại 2',
      reportTemplate: 'Mẫu 2',
      reportCode: 'BBKT003',
      reportGroup: 'Nhóm 2',
      frequency: 'Hàng tháng',
      scoreScale: '10',
    },
  ];

  columnWidths = {
    'min-width': '960px',
    width: '100%',
  };

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 },
  ];

  scriptEvaluations = [
    {
      id: 1,
      criteriaGroup: 'An toàn lao động',
      criteria: 'AT01 - Trang bị bảo hộ',
      frequency: 'Hàng ngày',
      evaluationResult: 'Đạt',
      evaluationContent: 'Đầy đủ trang bị',
      evaluationImage: 'at01.jpg',
    },
    {
      id: 2,
      criteriaGroup: 'An toàn lao động',
      criteria: 'AT02 - Thiết bị bảo vệ',
      frequency: 'Hàng tuần',
      evaluationResult: 'Đạt',
      evaluationContent: 'Hoạt động tốt',
      evaluationImage: 'at02.jpg',
    },
    {
      id: 3,
      criteriaGroup: '5S',
      criteria: '5S01 - Sàng lọc',
      frequency: 'Hàng ngày',
      evaluationResult: 'Không đạt',
      evaluationContent: 'Cần cải thiện',
      evaluationImage: '5s01.jpg',
    },
    {
      id: 4,
      criteriaGroup: '5S',
      criteria: '5S02 - Sắp xếp',
      frequency: 'Hàng tuần',
      evaluationResult: 'Đạt',
      evaluationContent: 'Ngăn nắp',
      evaluationImage: '5s02.jpg',
    },
    {
      id: 5,
      criteriaGroup: 'Quy trình sản xuất',
      criteria: 'QT01 - Kiểm soát',
      frequency: 'Hàng ngày',
      evaluationResult: 'Đạt',
      evaluationContent: 'Tuân thủ',
      evaluationImage: 'qt01.jpg',
    },
    {
      id: 6,
      criteriaGroup: 'Quy trình sản xuất',
      criteria: 'QT02 - Vận hành',
      frequency: 'Hàng tuần',
      evaluationResult: 'Đạt',
      evaluationContent: 'Đúng quy trình',
      evaluationImage: 'qt02.jpg',
    },
    {
      id: 7,
      criteriaGroup: 'Môi trường',
      criteria: 'MT01 - Xử lý rác',
      frequency: 'Hàng ngày',
      evaluationResult: 'Không đạt',
      evaluationContent: 'Cần phân loại',
      evaluationImage: 'mt01.jpg',
    },
    {
      id: 8,
      criteriaGroup: 'Môi trường',
      criteria: 'MT02 - Tiết kiệm',
      frequency: 'Hàng tháng',
      evaluationResult: 'Đạt',
      evaluationContent: 'Tiết kiệm tốt',
      evaluationImage: 'mt02.jpg',
    },
    {
      id: 9,
      criteriaGroup: 'Chất lượng',
      criteria: 'CL01 - KCS',
      frequency: 'Hàng ngày',
      evaluationResult: 'Đạt',
      evaluationContent: 'Đạt tiêu chuẩn',
      evaluationImage: 'cl01.jpg',
    },
    {
      id: 10,
      criteriaGroup: 'Chất lượng',
      criteria: 'CL02 - QC',
      frequency: 'Hàng tuần',
      evaluationResult: 'Đạt',
      evaluationContent: 'Kiểm soát tốt',
      evaluationImage: 'cl02.jpg',
    },
    {
      id: 11,
      criteriaGroup: 'Thiết bị',
      criteria: 'TB01 - Bảo trì',
      frequency: 'Hàng tháng',
      evaluationResult: 'Đạt',
      evaluationContent: 'Đúng lịch',
      evaluationImage: 'tb01.jpg',
    },
    {
      id: 12,
      criteriaGroup: 'Thiết bị',
      criteria: 'TB02 - Hiệu chuẩn',
      frequency: 'Hàng quý',
      evaluationResult: 'Đạt',
      evaluationContent: 'Định kỳ',
      evaluationImage: 'tb02.jpg',
    },
    {
      id: 13,
      criteriaGroup: 'Nhân sự',
      criteria: 'NS01 - Đào tạo',
      frequency: 'Hàng quý',
      evaluationResult: 'Đạt',
      evaluationContent: 'Đầy đủ',
      evaluationImage: 'ns01.jpg',
    },
    {
      id: 14,
      criteriaGroup: 'Nhân sự',
      criteria: 'NS02 - Đánh giá',
      frequency: '6 tháng',
      evaluationResult: 'Đạt',
      evaluationContent: 'Kịp thời',
      evaluationImage: 'ns02.jpg',
    },
    {
      id: 15,
      criteriaGroup: 'Văn phòng',
      criteria: 'VP01 - Tài liệu',
      frequency: 'Hàng tháng',
      evaluationResult: 'Đạt',
      evaluationContent: 'Lưu trữ tốt',
      evaluationImage: 'vp01.jpg',
    },
  ];

  planEvaluations: any[] = [];
  checkPlanDetails: any[] = [];
  criteriaSummaries: any = [];
  listImgReports: any[] = [];

  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  selectedPageSize: number = 10;
  first: number = 0;
  totalRecords: number = 0;
  dialogVisible = false;
  dialogCheckScript = false;
  dialogCheckPlan = false;
  dialogCheckPlanChild = false;
  conclusionCretia = false;
  dialogGeneralCheckPlan = false;
  dialogSummaryOfCriteriaConclusion = false;
  dialogViewImage = false;
  groupReportData: any = {};
  evaluators: any[] = [];
  planGrDetail: any[] = [];
  listEvalReports: any = [];
  listEvalReportBase: any = [];
  planGroup: any = {};
  selectedData: any = null;
  dialogVisibility: { [key: string]: boolean } = {};
  disableSaveCheckDate: { [key: string]: boolean } = {};
  selectedFiles: { dataKey: string; files: File[] }[] = [];
  imageLoadErrors = new Set<string>();
  report: any = {};
  reportSelected: any = {};
  currentPage: number = 0;

  trackId = (_index: number, item: IPlan): number => this.planService.getPlanIdentifier(item);

  constructor(
    public router: Router,
    protected planService: PlanService,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    protected convertService: ConvertService,
    protected sortService: SortService,
    protected ngZone: NgZone,
    protected summarizePlanDiaglog: SummarizePlanComponent,
    protected evaluatorService: EvaluatorService,
    protected planGrService: PlanGroupService,
    private exportExcelService: ExportExcelService,
  ) {}

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.plans || this.plans.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
    this.planService.getPlanDetail().subscribe(res => {
      this.planDetailResults = res;
      this.loadTreeNodes();
    });
    this.evaluatorService.getAllCheckTargets().subscribe(res => {
      this.evaluators = res;
    });
    this.convertService.query().subscribe(res => {
      this.listEvalReportBase = res.body;
    });
  }

  loadEvalTable(planId: number) {
    this.planGrService.findAllPlanGrByReportId(planId).subscribe(res => {
      this.planEvaluations = res.body || [];
      this.planEvaluations = this.planEvaluations
        .filter((item: any) => item.type === 'single')
        .map((item: any) => {
          const dateOnly = item.checkDate ? item.checkDate.split('T')[0] : '';
          return {
            ...item,
            checkDate: dateOnly,
          };
        });
      if (this.planEvaluations.length === 0) {
        this.planEvaluations.push({});
      }
    });
  }

  onPageSizeChange(event: any): void {
    this.selectedPageSize = event.rows;
    this.first = event.first;
  }

  delete(plan: IPlan): void {
    const modalRef = this.modalService.open(PlanDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.plan = plan;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.isLoading = true;
    this.queryBackend().subscribe({
      next: res => {
        if (res.body) {
          this.planDetailResults = res.body;
          this.totalRecords = this.planDetailResults.length;
          this.isLoading = false;
        }
      },
    });
  }

  // Sao chép kế hoạch
  copyPlan(plan: any): void {
    this.router.navigate([`/plan/${plan}/edit`], {
      state: {
        mode: 'COPY', // Add mode flag
      },
    });
  }

  // Phân quyền thực hiện kiểm tra
  openModal(): void {
    this.modalService
      .open(this.userTesting, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        backdrop: 'static',
      })
      .result.then(
        result => {
          // console.log('Modal closed');
        },
        reason => {
          // console.log('Modal dismissed');
        },
      );
  }

  // Gộp BBKT
  openModalGross(): void {
    this.modalService
      .open(this.gross, {
        ariaLabelledBy: 'modal-gross-title',
        // size: 'xl',
        // fullscreen: true,
        backdrop: 'static',
        windowClass: 'gross-modal',
        centered: true,
      })
      .result.then(
        result => {
          // console.log('Modal closed');
        },
        reason => {
          // console.log('Modal dismissed');
        },
      );
  }

  navigateToInspectionReport(): void {
    // modal.dismiss();
    this.router.navigate(['inspection-report']);
  }

  navigateToGrossScript(): void {
    this.router.navigate(['gross-script']);
  }

  navigateToScript(): void {
    this.router.navigate(['script']);
  }

  navigateToSummarizePlan(): void {
    this.router.navigate(['summarize-plan']);
  }

  openModalCriteria(): void {
    this.modalService
      .open(this.criteria, {
        ariaLabelledBy: 'modal-criteria-title',
        size: 'xl',
        backdrop: 'static',
      })
      .result.then(
        result => {
          // console.log('Modal closed');
        },
        reason => {
          // console.log('Modal dismissed');
        },
      );
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
          // console.log('Modal closed');
        },
        reason => {
          // console.log('Modal dismissed');
        },
      );
  }

  openModalInspectionData(): void {
    this.modalService
      .open(this.inspectionData, {
        ariaLabelledBy: 'modal-inspection-data-itle',
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

  openModalDeltailInspectionData(): void {
    this.modalService
      .open(this.detailInspectionData, {
        ariaLabelledBy: 'modal-detail-inspection-data-title',
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

  openModalCriteriaConclusion(): void {
    this.modalService
      .open(this.criteriaConclusion, {
        ariaDescribedBy: 'modal-criteria-conclusion-title',
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

  openModalEvaluationPlan(): void {
    this.modalService
      .open(this.evaluationPlan, {
        ariaDescribedBy: 'modal-evaluation-plan-title',
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

  onRowExpand(event: any): void {
    if (this.dt2 && this.dt2.paginator) {
      this.currentPage = this.dt2.first / this.dt2.rows;
    }
    const rowData = event.data;
    this.expandedRows[rowData.id] = true;
    this.loadPlanDetails(rowData.id);
    // console.log('rowData', rowData);
  }

  restorePaginatorState() {
    if (this.dt2 && this.dt2.paginator) {
      this.dt2.first = this.currentPage * this.dt2.rows;
      // Kích hoạt lại phân trang để nó áp dụng trạng thái mới
      this.dt2.onLazyLoad.emit({
        first: this.dt2.first,
        rows: this.dt2.rows,
        sortField: this.dt2.sortField,
        sortOrder: this.dt2.sortOrder,
        filters: this.dt2.filters,
        globalFilter: this.dt2.globalFilter,
      });
    }
  }

  loadPlanDetails(planId: number): void {
    this.planService.getPlanDetail().subscribe(res => {
      this.planDetailResults = res;
      setTimeout(() => {
        this.restorePaginatorState();
      }, 0);
    });
  }

  onRowCollapse(event: any): void {
    const rowData = event.data;
    delete this.expandedRows[rowData.id];
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  loadTreeNodes(): void {
    if (this.planDetailResults) {
      this.treeNodes = this.planDetailResults.map(plan => ({
        data: {
          id: plan.id,
          code: plan.code,
          name: plan.name,
          subjectOfAssetmentPlan: plan.subjectOfAssetmentPlan,
          frequency: plan.frequency,
          timeStart: plan.timeStart,
          timeEnd: plan.timeEnd,
          statusPlan: plan.statusPlan,
          testObject: plan.testObject,
          reportTypeId: plan.reportTypeId,
          reportTypeName: plan.reportTypeName,
          numberOfCheck: plan.numberOfCheck,
          implementer: plan.implementer,
          paticipant: plan.paticipant,
          checkerGroup: plan.checkerGroup,
          checkerName: plan.checkerName,
          checkerGroupId: plan.checkerGroupId,
          checkerId: plan.checkerId,
          gross: plan.gross,
          timeCheck: plan.timeCheck,
          nameResult: plan.nameResult,
          scriptId: plan.scriptId,
          createBy: plan.createBy,
          status: plan.status,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
          updateBy: plan.updateBy,
        },
        children: [],
        expanded: false,
      }));
    }
  }

  onGlobalSearch(event: any): void {
    this.dt2.filterGlobal(event.target.value, 'contains');
  }

  showDialogExcel(): void {
    this.dialogVisible = true;
  }

  showDialogCheckScript(): void {
    this.dialogCheckScript = true;
  }

  showDialogCheckPlan(data: any, index: number): void {
    this.planParent = data;
    this.report = data.planDetail[index];
    this.loadEvalTable(data.planDetail[index].id);
    this.dialogCheckPlan = true;
  }

  showDialogCheckPlanChild(data: any): void {
    // // Lấy kiểu đánh giá tương ứng với BBKT
    this.planGroup = data;
    this.listEvalReports = this.listEvalReportBase.filter((item: any) => item.type === this.report.convertScore);
    if (data.id) {
      this.planGrService.findAllDetail(data.id).subscribe(res => {
        this.planGrDetail = res.body.map((item: any) => {
          return {
            ...item,
            image: JSON.parse(item.image),
          };
        });
      });
    } else {
      this.report.detail = typeof this.report.detail === 'string' ? JSON.parse(this.report.detail) : this.report.detail;
      this.planGrDetail = this.report.detail.body.map((row: any) => {
        const criterialGroup = row.data.find((item: any) => item.index === 1)?.value || '';
        const criterial = row.data.find((item: any) => item.index === 2)?.value || '';
        return {
          criterialGroupName: criterialGroup,
          criterialName: criterial,
          createdBy: data.createdBy,
          frequency: row.frequency,
        };
      });
      this.planGrDetail.sort((a, b) => a.criterialGroupName.localeCompare(b.criterialGroupName));
    }
    this.dialogCheckPlanChild = true;
  }

  showDialogConclusionCretia(): void {
    this.conclusionCretia = true;
  }

  showSummarizeDialog(): void {
    this.summarizePlanDiaglog.dialogGeneralCheckPlan = true;
  }

  showDialogGeneralCheckPlan(Parentdata: any, data: any): void {
    this.reportSelected = data;
    this.reportService.getAllStatisticalByReportId(Parentdata.id, data.id).subscribe(res => {
      this.checkPlanDetails = res.body;
    });
    this.dialogGeneralCheckPlan = true;
  }

  showDialogSummaryOfCriteriaConclusion(data: any): void {
    this.planGrService.findAllDetailByHistoryAndReportId(data.planGroupHistoryId, this.reportSelected.id).subscribe(res => {
      this.criteriaSummaries = res.body;
      this.criteriaSummaries.sort((a: any, b: any) => {
        if (a.criterialGroupName < b.criterialGroupName) return -1;
        if (a.criterialGroupName > b.criterialGroupName) return 1;
        return 0;
      });
    });
    this.dialogSummaryOfCriteriaConclusion = true;
  }

  getSeverity(status: string): any {
    switch (status) {
      case 'Đạt':
        return 'success';
      case 'Không đạt':
        return 'danger';
      case 'Chờ đánh giá':
        return 'warning';
    }
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.plans = this.refineData(dataFromBody);
    // this.treeNodes = this.transformToTreeNodes(this.plans); // Transform to TreeNode
    this.convertPlansToTreeNodes();
  }

  protected convertPlansToTreeNodes(): void {
    if (this.plans) {
      this.treeNodes = this.plans.map(plan => ({
        data: plan,
        children: [],
      }));
    }
  }

  protected onResponseSuccess2(response: EntityArrayResponseType): void {
    const dataFromServer = this.fillComponentAttributesFromResponseBody(response.body);
    this.plans = dataFromServer;
  }

  protected refineData(data: IPlan[]): IPlan[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IPlan[] | null): IPlan[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.planService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }

  protected transformToTreeNodes(plans: IPlan[]): TreeNode[] {
    return plans.map(plan => ({
      data: plan,
      children: [],
    }));
  }

  addRowPlanEvaluation(): void {
    this.planEvaluations.push({});
  }

  deletePlanChild(data: any, index: number): void {
    if (data && data.length > 0) {
      data.splice(index, 1);
    }
  }

  checkEvent(data: any, index: number): void {
    const isDuplicate = data.some((item: any, i: number) => i !== index && item.checkDate === data[index].checkDate);
    if (isDuplicate) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'center-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen(toast) {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: 'Dữ liệu ngày kiểm tra đã tồn tại',
      });
      this.disableSaveCheckDate[index] = true;
    } else {
      this.disableSaveCheckDate[index] = false;
    }
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

  generateCode(planId: number): string {
    const uid = crypto.randomUUID();
    const currentDate = dayjs().format('DDMMYYYYHHmmssSSS');
    return `PG-${planId}-${uid}-${currentDate}`;
  }

  async savePlanGrAndDetail() {
    if (this.planGroup.id === undefined || this.planGroup.id === null) {
      this.planGroup.code = this.generateCode(this.planParent.id);
      this.planGroup.planId = this.planParent.id;
      this.planGroup.checkDate = dayjs(this.planGroup.checkDate).toISOString();
      this.planGroup.type = 'single';
      this.planGroup.createdAt = dayjs();
    } else {
      this.planGroup.checkDate = dayjs(this.planGroup.checkDate).toISOString();
    }
    try {
      const res = await this.planService.createGroupHistory(this.planGroup).toPromise();
      const arrRptGrDetail = this.planGrDetail.map(item => ({
        ...item,
        createdAt: this.planGroup.checkDate,
        createdBy: this.planGroup.createdBy,
        planGroupHistoryId: res.body,
        reportId: this.report.id,
        reportName: this.report.name,
        status: this.report.status,
        convertScore: this.report.convertScore,
        image: JSON.stringify(item.image),
      }));
      const uploadPromises = this.selectedFiles.flatMap(fileGroup =>
        fileGroup.files.map(file => this.planService.upLoadFile(file).toPromise()),
      );
      await Promise.all(uploadPromises);
      await this.planService.createGroupHistoryDetail(arrRptGrDetail).toPromise();
      const Toast = Swal.mixin({
        toast: true,
        position: 'center-end',
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
        title: 'Lưu dữ liệu thành công',
      });
      this.loadEvalTable(this.report.id);
      this.dialogCheckPlanChild = false;
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  }

  // Xuất excel
  exportSingleItemToExcel(selectedParentItem: any): void {
    if (!selectedParentItem || !selectedParentItem.id) {
      console.error('Không có dữ liệu cha hợp lệ để xuất Excel.');
      return;
    }

    // Bước 1: Tải dữ liệu con cho thằng cha được chọn
    this.planService.getAllStatisReportByPlanId(selectedParentItem.id).subscribe(res => {
      const details = res.body || [];
      this.generateExcelFile(selectedParentItem, details);
    });
  }

  /**
   * Tạo và xuất file Excel từ dữ liệu cha và con.
   * @param parentData Đối tượng PlanGroupHistory (cha).
   * @param childDetails Mảng các đối tượng PlanGroupHistoryDetail (con).
   */
  private generateExcelFile(parentData: any, childDetails: any[]): void {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // --- Cấu hình tiêu đề cho dữ liệu cha ---
    const parentHeaderRow = [
      'ID Kế hoạch',
      'Mã Kế hoạch',
      'Tên Kế hoạch',
      'Đối tượng đánh giá',
      'Tần suất',
      'Thời gian bắt đầu',
      'Thời gian kết thúc',
    ];

    // --- Cấu hình tiêu đề cho dữ liệu chi tiết ---
    const detailHeaderRow = [
      '', // Cột trống để thụt lề
      'Mã BBKT',
      'Tên BBKT',
      'Đối tượng kiểm tra',
      'Loại BBKT',
      'Số lần thực hiện kiểm tra',
      'Thang điểm',
      'Tổng điểm',
      'Loại quy đổi',
      'NC',
      'LC',
      'Số lượng không đạt',
      'Người kiểm tra',
      'Tần suất',
      'Trạng thái',
    ];

    // --- Dữ liệu cha ---
    let currentRowIndex = 0; // Theo dõi hàng hiện tại

    XLSX.utils.sheet_add_aoa(ws, [['Dữ liệu Kế hoạch Kiểm tra']], { origin: -1 });
    currentRowIndex++;

    XLSX.utils.sheet_add_aoa(ws, [parentHeaderRow], { origin: -1 });
    currentRowIndex++;

    const parentDataRow = [
      parentData.id,
      parentData.code,
      parentData.name,
      parentData.subjectOfAssetmentPlan,
      parentData.frequency,
      parentData.timeStart, // Giữ nguyên chuỗi ISO 8601
      parentData.timeEnd, // Giữ nguyên chuỗi ISO 8601
    ];
    XLSX.utils.sheet_add_aoa(ws, [parentDataRow], { origin: -1 });
    currentRowIndex++;

    // --- Dữ liệu con ---
    XLSX.utils.sheet_add_aoa(ws, [['']], { origin: -1 }); // Hàng trống
    currentRowIndex++;

    XLSX.utils.sheet_add_aoa(ws, [['Chi tiết Kế hoạch Kiểm tra']], { origin: -1 });
    currentRowIndex++;

    if (childDetails && childDetails.length > 0) {
      XLSX.utils.sheet_add_aoa(ws, [detailHeaderRow], { origin: -1 });
      currentRowIndex++;

      childDetails.forEach(detail => {
        const detailDataRow = [
          '', // Cột thụt lề
          detail.code,
          detail.name,
          detail.testOfObject,
          detail.reportType,
          detail.sumOfAudit,
          detail.scoreScale,
          this.getTotalPoit(detail), // Gọi hàm tính toán
          detail.convertScore,
          detail.sumOfNc,
          detail.sumOfLy,
          detail.sumOfFail,
          detail.checker,
          detail.frequency,
          detail.status,
        ];
        XLSX.utils.sheet_add_aoa(ws, [detailDataRow], { origin: -1 });
        currentRowIndex++;
      });
    } else {
      XLSX.utils.sheet_add_aoa(ws, [['Không có dữ liệu chi tiết cho kế hoạch này.']], { origin: -1 });
      currentRowIndex++;
    }

    // --- CẤU HÌNH ĐỘ RỘNG CỘT TỰ ĐỘNG VÀ ĐỊNH DẠNG ---

    // Đây là phần quan trọng để làm đẹp cột
    // Cấu hình độ rộng cho các cột của dữ liệu cha và con
    // Các số là độ rộng ký tự (character width)
    const columnWidthsParent = [
      { wch: 10 }, // ID Kế hoạch
      { wch: 25 }, // Mã Kế hoạch
      { wch: 30 }, // Tên Kế hoạch
      { wch: 25 }, // Đối tượng đánh giá
      { wch: 15 }, // Tần suất
      { wch: 25 }, // Thời gian bắt đầu (cho chuỗi ngày giờ đầy đủ)
      { wch: 25 }, // Thời gian kết thúc (cho chuỗi ngày giờ đầy đủ)
    ];

    const columnWidthsDetail = [
      { wch: 5 }, // Cột trống thụt lề
      { wch: 15 }, // Mã BBKT
      { wch: 25 }, // Tên BBKT
      { wch: 25 }, // Đối tượng kiểm tra
      { wch: 15 }, // Loại BBKT
      { wch: 25 }, // Số lần thực hiện kiểm tra
      { wch: 15 }, // Thang điểm
      { wch: 15 }, // Tổng điểm
      { wch: 18 }, // Loại quy đổi
      { wch: 8 }, // NC
      { wch: 8 }, // LC
      { wch: 18 }, // Số lượng không đạt
      { wch: 20 }, // Người kiểm tra
      { wch: 15 }, // Tần suất
      { wch: 15 }, // Trạng thái
    ];

    // Gán độ rộng cột cho worksheet
    // Lưu ý: ws['!cols'] sẽ áp dụng cho toàn bộ các cột.
    // Nếu bạn muốn độ rộng khác nhau cho phần cha và con, bạn sẽ phải tạo 2 sheet riêng biệt.
    // Với 1 sheet, bạn phải chọn độ rộng lớn nhất hoặc phù hợp nhất cho mỗi cột.
    // Ở đây, tôi sẽ gộp các cấu hình độ rộng.
    // Giả định số lượng cột tối đa là số cột của detailHeaderRow
    const maxCols = Math.max(parentHeaderRow.length, detailHeaderRow.length);
    const commonColumnWidths: XLSX.ColInfo[] = [];

    for (let i = 0; i < maxCols; i++) {
      let width = 10; // Default width
      if (columnWidthsParent[i] && columnWidthsParent[i].wch) {
        width = Math.max(width, columnWidthsParent[i].wch || 0);
      }
      if (columnWidthsDetail[i] && columnWidthsDetail[i].wch) {
        width = Math.max(width, columnWidthsDetail[i].wch || 0);
      }
      commonColumnWidths.push({ wch: width });
    }

    ws['!cols'] = commonColumnWidths;

    // --- Định dạng cho các ô Header (in đậm) ---
    // Để in đậm tiêu đề, bạn cần truy cập trực tiếp vào các ô (cells) và gán thuộc tính 's' (style)
    // Điều này phức tạp hơn với aoa_to_sheet. Cách đơn giản hơn là sau khi tạo sheet, bạn lặp qua các ô header.
    // Với cấu trúc hiện tại, chúng ta sẽ biết các hàng header nằm ở đâu.

    // Header Cha: Hàng 1 (index 1)
    parentHeaderRow.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: colIndex }); // Hàng 1, cột 0, 1, 2...
      if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: parentHeaderRow[colIndex] };
      if (!ws[cellAddress].s) ws[cellAddress].s = {};
      ws[cellAddress].s.font = { bold: true };
    });

    // Header Con: Hàng ngay sau tiêu đề "Chi tiết Kế hoạch Kiểm tra"
    // (Giả định nằm ở hàng 'currentRowIndex - childDetails.length - 1' sau khi thêm detail data)
    // Tốt hơn là lưu trữ chỉ số hàng cụ thể của header khi nó được thêm vào
    let detailHeaderRowIndex = 0;
    // Tìm chỉ số hàng của "Chi tiết Kế hoạch Kiểm tra"
    for (let r = 0; r < currentRowIndex; r++) {
      const cell = ws[XLSX.utils.encode_cell({ r: r, c: 0 })];
      if (cell && cell.v === 'Chi tiết Kế hoạch Kiểm tra') {
        detailHeaderRowIndex = r + 1; // Header con sẽ nằm ở hàng tiếp theo
        break;
      }
    }
    if (detailHeaderRowIndex > 0) {
      detailHeaderRow.forEach((_, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: detailHeaderRowIndex, c: colIndex });
        if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: detailHeaderRow[colIndex] };
        if (!ws[cellAddress].s) ws[cellAddress].s = {};
        ws[cellAddress].s.font = { bold: true };
      });
    }

    // --- Tạo và xuất workbook ---
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Chi tiết Kế hoạch');

    const fileName = `ChiTietKeHoach_${parentData.code || parentData.id}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  getTotalPoit(data: any) {
    if (data.convertScore == 'Tính điểm') {
      const markNC = this.listEvalReportBase.find((item: any) => item.name == 'NC');
      const markLC = this.listEvalReportBase.find((item: any) => item.name == 'LY');
      const totalPointSummarize = data.scoreScale * data.sumOfAudit - (data.sumOfLy * markLC.mark + data.sumOfNc * markNC.mark);
      return totalPointSummarize;
    } else {
      return data.scoreScale;
    }
  }

  converTotalPointError(data: any) {
    const markNC = this.listEvalReportBase.find((item: any) => item.name == 'NC');
    const markLC = this.listEvalReportBase.find((item: any) => item.name == 'LY');
    const totalPointError = data.sumOfLy * markLC.mark + data.sumOfNc * markNC.mark;
    return data.convertScore == 'Tính điểm' ? totalPointError : data.sumOfFail;
  }

  totalPointSummarize(data: any) {
    if (this.reportSelected.convertScore == 'Tính điểm') {
      const markNC = this.listEvalReportBase.find((item: any) => item.name == 'NC');
      const markLC = this.listEvalReportBase.find((item: any) => item.name == 'LY');
      const totalPointSummarize = this.reportSelected.scoreScale - (data.sumOfLy * markLC.mark + data.sumOfNc * markNC.mark);
      return totalPointSummarize;
    } else {
      return this.reportSelected.scoreScale;
    }
  }

  showDialogViewImg(data: any) {
    this.listImgReports = JSON.parse(data);
    this.dialogViewImage = true;
  }

  exportExcel(reportId: number) {
    this.exportExcelService.exportToExcel(reportId);
  }
}
