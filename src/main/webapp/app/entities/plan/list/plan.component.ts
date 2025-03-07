import { Component, NgZone, inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeNode } from 'primeng/api'; // Import TreeNode

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule, NgModel } from '@angular/forms';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  standalone: true,
  selector: 'jhi-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['../../shared.component.css'],
  // animations: [
  //   trigger('overlayContentAnimation', [
  //     state('void', style({
  //       transform: 'translateY(5%)',
  //       opacity: 0
  //     })),
  //     state('visible', style({
  //       transform: 'translateY(0)',
  //       opacity: 1
  //     })),
  //     transition('void => visible', animate('225ms ease-out')),
  //     transition('visible => void', animate('195ms ease-in'))
  //   ])
  // ],
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

    // BrowserAnimationsModule,
    // CommonModule
  ],
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
  // userTesting: any;
  @ViewChild('userTesting') userTesting!: TemplateRef<any>;
  @ViewChild('gross') gross!: TemplateRef<any>;
  @ViewChild('criteria') criteria!: TemplateRef<any>;
  @ViewChild('evaluationResult') evaluationResult!: TemplateRef<any>;
  @ViewChild('inspectionData') inspectionData!: TemplateRef<any>;
  @ViewChild('detailInspectionData') detailInspectionData!: TemplateRef<any>;
  @ViewChild('criteriaConclusion') criteriaConclusion!: TemplateRef<any>;
  @ViewChild('evaluationPlan') evaluationPlan!: TemplateRef<any>;
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

  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  selectedPageSize: number = 10;
  first: number = 0;
  totalRecords: number = 0;

  public router = inject(Router);
  protected planService = inject(PlanService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: IPlan): number => this.planService.getPlanIdentifier(item);

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
      console.log('db trả về', res);
    });
    // this.loadTreeNodes();
    // console.log('plans', this.plans);

    // this.columnDefinitions = [
    //   {
    //     id: 'id',
    //     name: 'ID',
    //     field: 'id',
    //     sortable: true,
    //     filterable: true,
    //     resizable: true,
    //     width: 100,
    //   },
    //   {
    //   }
    // ]
  }

  // expandAll():void {
  //   this.expandedRows = this.planData.reduce((acc, p) => (acc[p.id] = true) && acc, {});
  // }

  // collapseAll():void {
  //   this.expandedRows = {};
  // }

  onPageSizeChange(event: any): void {
    console.log('event', event);
    this.selectedPageSize = event.rows;
    this.first = event.first;
    // this.load();
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

  // onFilter(event: Event, field: string):void {
  //   const element = event.target as HTMLInputElement;
  //   if (this.dt2) {
  //     this.dt2.filter(element.value, field, 'contains');
  //   }
  // }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        this.loadTreeNodes();
        this.totalRecords = this.planDetailResults.length;
        console.log('res ', res);
        console.log('tree node', this.loadTreeNodes);
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
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
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
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
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

  openModalCriteria(): void {
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
    const rowData = event.data;
    this.expandedRows[rowData.id] = true;
    console.log('rowData', rowData);
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
}
