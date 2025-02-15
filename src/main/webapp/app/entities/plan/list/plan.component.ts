import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import {
  Column,
  GridOption,
  Formatters,
  OnEventArgs,
  AngularGridInstance,
  FieldType,
  Filters,
  Editors,
  LongTextEditorOption,
  Formatter,
} from 'angular-slickgrid';

// interface TreeNode {
//   data: IPlan;
//   children: TreeNode[];
// }

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
    // ToastModule
  ],
})


export class PlanComponent implements OnInit {
  subscription: Subscription | null = null;
  plans?: IPlan[];
  isLoading = false;
  treeNodes!: TreeNode[];
  columnDefinitions?: IPlan[];
  gridOptions: GridOption = {};
  angularGrid?: AngularGridInstance;
  sortState = sortStateSignal({});
  files?: TreeNode[];
  expandedRows: { [key: string]: boolean } = {};
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
          status: 'PENDING'
        },
        {
          id: '1000-1',
          productCode: 'f230fh0g3',
          date: '2020-05-14',
          amount: 130,
          quantity: 2,
          customer: 'Leon Rodrigues',
          status: 'DELIVERED'
        },
        {
          id: '1000-2',
          productCode: 'f230fh0g3',
          date: '2019-01-04',
          amount: 65,
          quantity: 1,
          customer: 'Juan Alejandro',
          status: 'RETURNED'
        },
        {
          id: '1000-3',
          productCode: 'f230fh0g3',
          date: '2020-09-13',
          amount: 195,
          quantity: 3,
          customer: 'Claire Morrow',
          status: 'CANCELLED'
        }
      ]
    }]

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
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        this.loadTreeNodes();
        console.log('res ', res);
        console.log('tree node', this.loadTreeNodes)
      },
    });
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
    if (this.plans) {
      this.treeNodes = this.plans.map(plan => ({
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
          updateBy: plan.updateBy
        },
        children: [],
        expanded: false
      }));
    }
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.plans = this.refineData(dataFromBody);
    // this.treeNodes = this.transformToTreeNodes(this.plans); // Transform to TreeNode
    this.convertPlansToTreeNodes()
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
      children: []
    }));
  }
}
