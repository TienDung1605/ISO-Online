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
  ],
})
export class TitleComponent implements OnInit {
  subscription: Subscription | null = null;
  titles?: ITitle[];
  isLoading = false;

  sortState = sortStateSignal({});
  title: ITitle[] = [];
  filteredTitles: ITitle[] = [];
  searchTerms: { [key: string]: string } = {
    id: '',
    name: '',
    source: '',
    createdAt: '',
    updatedAt: '',
    dataType: '',
    updateBy: '',
    field: '',
  };

  page = 1;
  pageSize = 10;
  totalItems = 0;

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
    this.titleService
      .query({
        page: this.page - 1,
        size: this.pageSize,
        sort: this.sortState(),
      })
      .subscribe(respone => {
        this.filteredTitles = respone.body ?? [];
        this.titles = [...this.filteredTitles];
      });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.load();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = Number(target.value);
    this.page = 1;
    this.load();
  }

  searchTable(): void {
    this.titles = this.filteredTitles.filter(title => {
      const nameMatch = !this.searchTerms.name || (title.name && title.name.toLowerCase().includes(this.searchTerms.name.toLowerCase()));

      const sourceMatch =
        !this.searchTerms.source || (title.source && title.source.toLowerCase().includes(this.searchTerms.source.toLowerCase()));

      const createdAtMatch =
        !this.searchTerms.createdAt || (title.createdAt && title.createdAt.toString().includes(this.searchTerms.createdAt));

      const updatedAtMatch =
        !this.searchTerms.updatedAt || (title.updatedAt && title.updatedAt.toString().includes(this.searchTerms.updatedAt));

      const updateByMatch =
        !this.searchTerms.updateBy || (title.updateBy && title.updateBy.toLowerCase().includes(this.searchTerms.updateBy.toLowerCase()));

      const fieldMatch = !this.searchTerms.field || (title.field && title.field.toString().includes(this.searchTerms.field));

      const dataTypeMatch = !this.searchTerms.dataType || (title.dataType && title.dataType.toString().includes(this.searchTerms.dataType));

      return nameMatch && sourceMatch && fieldMatch && createdAtMatch && updatedAtMatch && updateByMatch && dataTypeMatch;
    });
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
