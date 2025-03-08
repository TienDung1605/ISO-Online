import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IConvert } from '../convert.model';
import { EntityArrayResponseType, ConvertService } from '../service/convert.service';
import { ConvertDeleteDialogComponent } from '../delete/convert-delete-dialog.component';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { ItemCountComponent } from 'app/shared/pagination';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { HttpHeaders } from '@angular/common/http';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

// import { Account } from 'app/core/auth/account.model';
// import { AccountService } from 'app/core/auth/account.service';
@Component({
  standalone: true,
  selector: 'jhi-convert',
  templateUrl: './convert.component.html',
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
    TreeTableModule,
    NgbPaginationModule,
    ItemCountComponent,
    PaginatorModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
  ],
})
export class ConvertComponent implements OnInit {
  subscription: Subscription | null = null;
  converts?: IConvert[];
  isLoading = false;
  sortState = sortStateSignal({});
  convertResult: any[] = [];
  page = 1;
  totalItems = 0;
  itemsPerPage = 10;

  selectedPageSize: number = 10;
  rows = 10;

  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;

  filters = {
    id: '',
    name: '',
    type: '',
    mark: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
  };

  // account: Account | null = null;

  public router = inject(Router);
  protected convertService = inject(ConvertService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  // protected accountService = inject(AccountService);

  trackId = (_index: number, item: IConvert): number => this.convertService.getConvertIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.converts || this.converts.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(convert: IConvert): void {
    const modalRef = this.modalService.open(ConvertDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.convert = convert;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.isLoading = true;
    this.convertService
      .query({
        page: Math.floor(this.first / this.selectedPageSize),
        size: this.selectedPageSize,
        sort: this.sortState(),
      })
      .subscribe({
        next: response => {
          if (response.body) {
            this.converts = response.body;
            this.convertResult = [...this.converts];
            this.totalRecords = this.converts.length;
            this.isLoading = false;
            console.log('convert Result', this.convertResult);
            console.log('total', this.totalRecords);
          }
        },
      });
  }

  onPageSizeChange(event: any): void {
    this.selectedPageSize = event.rows;
    this.first = event.first;
    // this.load();
    console.log('page size', event.rows);
    console.log('first', event.first);
  }

  searchTable(): void {
    if (!this.converts) {
      return;
    }
    this.convertResult = this.converts.filter(convert => {
      const createdDate = convert.createdAt ? new Date(convert.createdAt.toDate()).toISOString().split('T')[0] : '';
      const updatedDate = convert.updatedAt ? new Date(convert.updatedAt.toDate()).toISOString().split('T')[0] : '';
      const searchCreatedDate = this.filters.createdAt ? new Date(this.filters.createdAt).toISOString().split('T')[0] : '';
      const searchUpdatedDate = this.filters.updatedAt ? new Date(this.filters.updatedAt).toISOString().split('T')[0] : '';

      return (
        (!this.filters.name || convert.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.type || convert.type?.toLowerCase().includes(this.filters.type.toLowerCase())) &&
        (!this.filters.mark || convert.mark?.toLowerCase().includes(this.filters.mark.toLowerCase())) &&
        (!this.filters.createdAt || createdDate === searchCreatedDate) &&
        (!this.filters.updatedAt || updatedDate === searchUpdatedDate) &&
        (!this.filters.updateBy || convert.updateBy?.toLowerCase().includes(this.filters.updateBy.toLowerCase()))
      );
    });
    this.totalRecords = this.convertResult.length;
  }

  onSearch(convert: keyof typeof this.filters, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters[convert] = value;
    this.searchTable();
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page, event);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState());
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.converts = dataFromBody;
  }

  protected refineData(data: IConvert[]): IConvert[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IConvert[] | null): IConvert[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      page: this.first / this.rows,
      size: this.rows,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.convertService.query(queryObject).pipe(
      tap((response: EntityArrayResponseType) => {
        this.isLoading = false;
        if (response.body) {
          this.converts = response.body;
          this.totalItems = Number(response.headers.get(TOTAL_COUNT_RESPONSE_HEADER));
        }
      }),
    );
  }

  protected handleNavigation(page: number, sortState: SortState): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
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
