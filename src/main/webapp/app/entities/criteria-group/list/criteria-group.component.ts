import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { ICriteriaGroup } from '../criteria-group.model';
import { EntityArrayResponseType, CriteriaGroupService } from '../service/criteria-group.service';
import { CriteriaGroupDeleteDialogComponent } from '../delete/criteria-group-delete-dialog.component';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'jhi-criteria-group',
  templateUrl: './criteria-group.component.html',
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
export class CriteriaGroupComponent implements OnInit {
  subscription: Subscription | null = null;
  criteriaGroups?: ICriteriaGroup[];
  isLoading = false;

  sortState = sortStateSignal({});
  criteriaGroupResult: any[] = [];
  page = 1;
  totalItems = 0;
  selectedPageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;
  filters = {
    name: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
  };

  public router = inject(Router);
  protected criteriaGroupService = inject(CriteriaGroupService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: ICriteriaGroup): number => this.criteriaGroupService.getCriteriaGroupIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.criteriaGroups || this.criteriaGroups.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(criteriaGroup: ICriteriaGroup): void {
    const modalRef = this.modalService.open(CriteriaGroupDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.criteriaGroup = criteriaGroup;
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
          this.criteriaGroups = res.body;
          this.criteriaGroupResult = [...this.criteriaGroups];
          this.totalRecords = this.criteriaGroups.length;
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
    if (!this.criteriaGroups) {
      return;
    }

    this.criteriaGroupResult = this.criteriaGroups.filter(criteriaGroup => {
      const createdDate = criteriaGroup.createdAt ? new Date(criteriaGroup.createdAt.toDate()).toISOString().split('T')[0] : '';
      const updatedDate = criteriaGroup.updatedAt ? new Date(criteriaGroup.updatedAt.toDate()).toISOString().split('T')[0] : '';
      const searchCreatedDate = this.filters.createdAt ? new Date(this.filters.createdAt).toISOString().split('T')[0] : '';
      const searchUpdatedDate = this.filters.updatedAt ? new Date(this.filters.updatedAt).toISOString().split('T')[0] : '';

      return (
        (!this.filters.name || criteriaGroup.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.status || criteriaGroup.status?.toString().includes(this.filters.status)) &&
        (!this.filters.createdAt || createdDate === searchCreatedDate) &&
        (!this.filters.updatedAt || updatedDate === searchUpdatedDate) &&
        (!this.filters.updateBy || criteriaGroup.updateBy?.toLowerCase().includes(this.filters.updateBy.toLowerCase()))
      );
    });
    this.totalRecords = this.criteriaGroupResult.length;
  }

  onSearch(criteriaGroup: keyof typeof this.filters, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters[criteriaGroup] = value;
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
    this.criteriaGroups = this.refineData(dataFromBody);
  }

  protected refineData(data: ICriteriaGroup[]): ICriteriaGroup[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: ICriteriaGroup[] | null): ICriteriaGroup[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.criteriaGroupService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
