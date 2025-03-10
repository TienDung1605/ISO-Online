import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { ITitle } from '../title.model';
import { EntityArrayResponseType, TitleService } from '../service/title.service';
import { TitleDeleteDialogComponent } from '../delete/title-delete-dialog.component';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  standalone: true,
  selector: 'jhi-title',
  templateUrl: './title.component.html',
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
  ],
})
export class TitleComponent implements OnInit {
  subscription: Subscription | null = null;
  titles?: ITitle[];
  isLoading = false;

  sortState = sortStateSignal({});
  titleResult: any[] = [];
  page = 1;
  totalItems = 0;
  selectedPageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;
  filters = {
    name: '',
    source: '',
    createdAt: '',
    updatedAt: '',
    dataType: '',
    field: '',
    updateBy: '',
  };

  public router = inject(Router);
  protected titleService = inject(TitleService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: ITitle): number => this.titleService.getTitleIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.titles || this.titles.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(title: ITitle): void {
    const modalRef = this.modalService.open(TitleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = title;
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
          this.titles = res.body;
          this.titleResult = [...this.titles];
          this.totalRecords = this.titles.length;
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
    if (!this.titles) {
      return;
    }

    this.titleResult = this.titles.filter(title => {
      const createdDate = title.createdAt ? new Date(title.createdAt.toDate()).toISOString().split('T')[0] : '';
      const updatedDate = title.updatedAt ? new Date(title.updatedAt.toDate()).toISOString().split('T')[0] : '';
      const searchCreatedDate = this.filters.createdAt ? new Date(this.filters.createdAt).toISOString().split('T')[0] : '';
      const searchUpdatedDate = this.filters.updatedAt ? new Date(this.filters.updatedAt).toISOString().split('T')[0] : '';

      return (
        (!this.filters.name || title.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.source || title.source?.toString().includes(this.filters.source)) &&
        (!this.filters.createdAt || createdDate === searchCreatedDate) &&
        (!this.filters.updatedAt || updatedDate === searchUpdatedDate) &&
        (!this.filters.dataType || title.dataType?.toString().includes(this.filters.dataType)) &&
        (!this.filters.field || title.field?.toString().includes(this.filters.field)) &&
        (!this.filters.updateBy || title.updateBy?.toLowerCase().includes(this.filters.updateBy.toLowerCase()))
      );
    });
    this.totalRecords = this.titleResult.length;
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

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.titles = this.refineData(dataFromBody);
  }

  protected refineData(data: ITitle[]): ITitle[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: ITitle[] | null): ITitle[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.titleService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
