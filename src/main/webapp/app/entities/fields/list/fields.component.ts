import { Component, NgZone, inject, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ItemCountComponent } from 'app/shared/pagination';
import { FormsModule } from '@angular/forms';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IFields } from '../fields.model';
import { EntityArrayResponseType, FieldsService } from '../service/fields.service';
import { FieldsDeleteDialogComponent } from '../delete/fields-delete-dialog.component';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  standalone: true,
  selector: 'jhi-fields',
  templateUrl: './fields.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    TableModule,
    IconFieldModule,
    InputIconModule,
  ],
})
export class FieldsComponent implements OnInit {
  subscription: Subscription | null = null;
  fields?: any[];
  fieldResult: any[] = [];
  isLoading = false;

  sortState = sortStateSignal({});

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  selectedPageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;

  filters = {
    name: '',
    field_name: '',
    source: '',
    created_at: '',
    updated_at: '',
    create_by: '',
  };

  public router = inject(Router);
  protected fieldsService = inject(FieldsService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: IFields): number => this.fieldsService.getFieldsIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.load()),
      )
      .subscribe();
  }

  delete(fields: IFields): void {
    const modalRef = this.modalService.open(FieldsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fields = fields;
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
    //     console.log('res', res)
    //   },
    // });
    this.fieldsService.getAllFields().subscribe({
      next: res => {
        if (res.body) {
          this.fields = res.body;
          this.fieldResult = [...this.fields!];
          this.totalRecords = this.fields!.length;
        }
      },
    });
    this.isLoading = true;
    // this.queryBackend().subscribe({
    //   next: res => {
    //     if (res.body) {
    //       this.fields = res.body;
    //       this.fieldResult = [...this.fields];
    //       this.totalRecords = this.fields.length;
    //       this.isLoading = false;
    //       console.log('body', res.body);
    //     }
    //   },
    // });
  }

  searchTable(): void {
    if (!this.fields) {
      return;
    }

    this.fieldResult = this.fields.filter(
      item =>
        (!this.filters.name || item.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.field_name || item.field_name?.toLowerCase().includes(this.filters.field_name.toLowerCase())) &&
        (!this.filters.source || item.source?.toString().includes(this.filters.source)) &&
        (!this.filters.created_at || item.created_at?.toString().includes(this.filters.created_at)) &&
        (!this.filters.updated_at || item.updated_at?.toString().includes(this.filters.updated_at)) &&
        (!this.filters.create_by || item.create_by?.toLowerCase().includes(this.filters.create_by.toLowerCase())),
    );
    this.totalRecords = this.fieldResult.length;
  }

  onSearch(field: keyof typeof this.filters, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters[field] = value;
    this.searchTable();
  }

  onPageSizeChange(event: any): void {
    this.selectedPageSize = event.rows;
    this.first = event.first;
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
    this.fields = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IFields[] | null): IFields[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    const { page } = this;

    this.isLoading = true;
    const pageToLoad: number = page;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.fieldsService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
