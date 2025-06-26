import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { ICheckTarget } from '../check-target.model';
import { EntityArrayResponseType, CheckTargetService } from '../service/check-target.service';
import { CheckTargetDeleteDialogComponent } from '../delete/check-target-delete-dialog.component';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { CheckLevelService } from 'app/entities/check-level/service/check-level.service';
import { CheckerGroupService } from 'app/entities/checker-group/service/checker-group.service';
@Component({
  standalone: true,
  selector: 'jhi-check-target',
  templateUrl: './check-target.component.html',
  styleUrls: ['../../shared.component.css'],
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    TableModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
  ],
})
export class CheckTargetComponent implements OnInit {
  subscription: Subscription | null = null;
  checkTargets?: ICheckTarget[];
  isLoading = false;

  sortState = sortStateSignal({});
  checkTargetResult: any[] = [];
  page = 1;
  totalItems = 0;
  selectedPageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;
  filters = {
    name: '',
    inspectionTarget: '',
    createdAt: '',
    updatedAt: '',
    evaluationLevelId: '',
    checkGroupId: '',
    status: '',
    updateBy: '',
  };

  public router = inject(Router);
  protected checkTargetService = inject(CheckTargetService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  protected checkLevelService = inject(CheckLevelService);
  protected checkGroupService = inject(CheckerGroupService);
  trackId = (_index: number, item: ICheckTarget): number => this.checkTargetService.getCheckTargetIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.checkTargets || this.checkTargets.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(checkTarget: ICheckTarget): void {
    const modalRef = this.modalService.open(CheckTargetDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.checkTarget = checkTarget;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    // this.queryBackend().subscribe({
    //   next: (res: EntityArrayResponseType) => {
    //     this.onResponseSuccess(res);
    //   },
    // });
    this.isLoading = true;
    this.queryBackend().subscribe({
      next: res => {
        if (res.body) {
          this.checkTargets = res.body;
          this.checkTargetResult = [...this.checkTargets];
          this.checkLevelService.query().subscribe(res1 => {
            if (res1.body) {
              this.checkTargetResult?.forEach(checkTarget => {
                checkTarget.evaluationLevel = res1.body!.find(checkLevel => checkLevel.id === checkTarget.evaluationLevelId)?.name;
              });
            }
          });
          this.checkGroupService.query().subscribe(res1 => {
            if (res1.body) {
              this.checkTargetResult?.forEach(checkTarget => {
                checkTarget.evalCheckGroup = res1.body!.find(checkGroup => checkGroup.id === checkTarget.checkGroupId)?.name;
              });
            }
          });
          this.totalRecords = this.checkTargets.length;
          this.isLoading = false;
        }
      },
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.load();
  }

  searchTable(): void {
    if (!this.checkTargets) {
      return;
    }

    this.checkTargetResult = this.checkTargets.filter(checkTarget => {
      const createdDate = checkTarget.createdAt ? new Date(checkTarget.createdAt.toDate()).toISOString().split('T')[0] : '';
      const updatedDate = checkTarget.updatedAt ? new Date(checkTarget.updatedAt.toDate()).toISOString().split('T')[0] : '';
      const searchCreatedDate = this.filters.createdAt ? new Date(this.filters.createdAt).toISOString().split('T')[0] : '';
      const searchUpdatedDate = this.filters.updatedAt ? new Date(this.filters.updatedAt).toISOString().split('T')[0] : '';

      return (
        (!this.filters.name || checkTarget.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.inspectionTarget || checkTarget.inspectionTarget?.toString().includes(this.filters.inspectionTarget)) &&
        (!this.filters.createdAt || createdDate === searchCreatedDate) &&
        (!this.filters.updatedAt || updatedDate === searchUpdatedDate) &&
        (!this.filters.evaluationLevelId || checkTarget.evaluationLevelId?.toString().includes(this.filters.evaluationLevelId)) &&
        (!this.filters.checkGroupId || checkTarget.checkGroupId?.toString().includes(this.filters.checkGroupId)) &&
        (!this.filters.status || checkTarget.status?.toString().includes(this.filters.status)) &&
        (!this.filters.updateBy || checkTarget.updateBy?.toLowerCase().includes(this.filters.updateBy.toLowerCase()))
      );
    });
    this.totalRecords = this.checkTargetResult.length;
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

  getSeverity(status: string): any {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'DEACTIVATE':
        return 'danger';
    }
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.checkTargets = this.refineData(dataFromBody);
  }

  protected refineData(data: ICheckTarget[]): ICheckTarget[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: ICheckTarget[] | null): ICheckTarget[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.checkTargetService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
}
