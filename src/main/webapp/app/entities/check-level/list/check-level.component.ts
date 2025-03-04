import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { ICheckLevel } from '../check-level.model';
import { EntityArrayResponseType, CheckLevelService } from '../service/check-level.service';
import { CheckLevelDeleteDialogComponent } from '../delete/check-level-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-check-level',
  templateUrl: './check-level.component.html',
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
export class CheckLevelComponent implements OnInit {
  subscription: Subscription | null = null;
  checkLevels?: ICheckLevel[];
  isLoading = false;

  sortState = sortStateSignal({});

  filteredCheckLevels: ICheckLevel[] = [];
  searchTerms: { [key: string]: string } = {
    id: '',
    name: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
  };

  page = 1;
  pageSize = 10;
  totalItems = 0;

  public router = inject(Router);
  protected checkLevelService = inject(CheckLevelService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: ICheckLevel): number => this.checkLevelService.getCheckLevelIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.checkLevels || this.checkLevels.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  searchTable(): void {
    this.checkLevels = this.filteredCheckLevels.filter(convert => {
      const nameMatch =
        !this.searchTerms.name || (convert.name && convert.name.toLowerCase().includes(this.searchTerms.name.toLowerCase()));

      const createdAtMatch =
        !this.searchTerms.createdAt || (convert.createdAt && convert.createdAt.toString().includes(this.searchTerms.createdAt));

      const updatedAtMatch =
        !this.searchTerms.updatedAt || (convert.updatedAt && convert.updatedAt.toString().includes(this.searchTerms.updatedAt));

      const updateByMatch =
        !this.searchTerms.updateBy ||
        (convert.updateBy && convert.updateBy.toLowerCase().includes(this.searchTerms.updateBy.toLowerCase()));

      return nameMatch && createdAtMatch && updatedAtMatch && updateByMatch;
    });
  }

  delete(checkLevel: ICheckLevel): void {
    const modalRef = this.modalService.open(CheckLevelDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.checkLevel = checkLevel;
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
    this.checkLevelService
      .query({
        page: this.page - 1,
        size: this.pageSize,
        sort: this.sortState(),
      })
      .subscribe(response => {
        this.filteredCheckLevels = response.body ?? [];
        this.checkLevels = [...this.filteredCheckLevels];
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

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.checkLevels = this.refineData(dataFromBody);
  }

  protected refineData(data: ICheckLevel[]): ICheckLevel[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: ICheckLevel[] | null): ICheckLevel[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.checkLevelService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
