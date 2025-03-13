import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { ICriteria } from '../criteria.model';
import { EntityArrayResponseType, CriteriaService } from '../service/criteria.service';
import { CriteriaDeleteDialogComponent } from '../delete/criteria-delete-dialog.component';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { CriteriaGroupService } from 'app/entities/criteria-group/service/criteria-group.service';

@Component({
  standalone: true,
  selector: 'jhi-criteria',
  templateUrl: './criteria.component.html',
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
export class CriteriaComponent implements OnInit {
  subscription: Subscription | null = null;
  criteria?: ICriteria[];
  isLoading = false;

  sortState = sortStateSignal({});
  criteriaResult: any[] = [];
  page = 1;
  totalItems = 0;
  selectedPageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;
  filters = {
    name: '',
    criterialGroupId: '',
    createdAt: '',
    updatedAt: '',
    status: '',
    updateBy: '',
  };

  public router = inject(Router);
  protected criteriaService = inject(CriteriaService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  protected criteriaGroupService = inject(CriteriaGroupService);
  trackId = (_index: number, item: ICriteria): number => this.criteriaService.getCriteriaIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          this.load();
        }),
      )
      .subscribe();
  }

  delete(criteria: ICriteria): void {
    const modalRef = this.modalService.open(CriteriaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.criteria = criteria;
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
          this.criteria = res.body;
          this.criteriaResult = [...this.criteria];
          this.criteriaGroupService.query().subscribe(res1 => {
            if (res1.body) {
              this.criteria?.forEach(criteria => {
                const result = res1.body!.find((item: any) => item.id === criteria.criterialGroupId);
                if (result) {
                  criteria.name = result.name;
                }
              });
            }
          });
          this.totalRecords = this.criteria.length;
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
    if (!this.criteria) {
      return;
    }

    this.criteriaResult = this.criteria.filter(criterias => {
      const createdDate = criterias.createdAt ? new Date(criterias.createdAt.toDate()).toISOString().split('T')[0] : '';
      const updatedDate = criterias.updatedAt ? new Date(criterias.updatedAt.toDate()).toISOString().split('T')[0] : '';
      const searchCreatedDate = this.filters.createdAt ? new Date(this.filters.createdAt).toISOString().split('T')[0] : '';
      const searchUpdatedDate = this.filters.updatedAt ? new Date(this.filters.updatedAt).toISOString().split('T')[0] : '';

      return (
        (!this.filters.name || criterias.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.criterialGroupId || criterias.criterialGroupId?.toString().includes(this.filters.criterialGroupId)) &&
        (!this.filters.createdAt || createdDate === searchCreatedDate) &&
        (!this.filters.updatedAt || updatedDate === searchUpdatedDate) &&
        (!this.filters.status || criterias.status?.toString().includes(this.filters.status)) &&
        (!this.filters.updateBy || criterias.updateBy?.toLowerCase().includes(this.filters.updateBy.toLowerCase()))
      );
    });
    this.totalRecords = this.criteria.length;
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
    this.criteria = this.refineData(dataFromBody);
  }

  protected refineData(data: ICriteria[]): ICriteria[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: ICriteria[] | null): ICriteria[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.criteriaService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
