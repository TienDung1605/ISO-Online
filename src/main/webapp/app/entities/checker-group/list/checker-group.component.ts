import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { ICheckerGroup } from '../checker-group.model';
import { EntityArrayResponseType, CheckerGroupService } from '../service/checker-group.service';
import { CheckerGroupDeleteDialogComponent } from '../delete/checker-group-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-checker-group',
  templateUrl: './checker-group.component.html',
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
export class CheckerGroupComponent implements OnInit {
  subscription: Subscription | null = null;
  checkerGroups?: ICheckerGroup[];
  isLoading = false;
  filteredCheckerGroups: ICheckerGroup[] = [];
  sortState = sortStateSignal({});
  searchTerms: { [key: string]: string } = {
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
  protected checkerGroupService = inject(CheckerGroupService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: ICheckerGroup): number => this.checkerGroupService.getCheckerGroupIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.checkerGroups || this.checkerGroups.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(checkerGroup: ICheckerGroup): void {
    const modalRef = this.modalService.open(CheckerGroupDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.checkerGroup = checkerGroup;
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
    this.checkerGroupService
      .query({
        page: this.page - 1,
        size: this.pageSize,
        sort: this.sortState(),
      })
      .subscribe(response => {
        this.filteredCheckerGroups = response.body ?? [];
        this.checkerGroups = [...this.filteredCheckerGroups];
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
    this.checkerGroups = this.filteredCheckerGroups.filter(convert => {
      const nameMatch =
        !this.searchTerms.name || (convert.name && convert.name.toLowerCase().includes(this.searchTerms.name.toLowerCase()));

      const statusMatch =
        !this.searchTerms.status || (convert.status && convert.status.toLowerCase().includes(this.searchTerms.status.toLowerCase()));

      const createdAtMatch =
        !this.searchTerms.createdAt || (convert.createdAt && convert.createdAt.toString().includes(this.searchTerms.createdAt));

      const updatedAtMatch =
        !this.searchTerms.updatedAt || (convert.updatedAt && convert.updatedAt.toString().includes(this.searchTerms.updatedAt));

      const updateByMatch =
        !this.searchTerms.updateBy ||
        (convert.updateBy && convert.updateBy.toLowerCase().includes(this.searchTerms.updateBy.toLowerCase()));

      return nameMatch && statusMatch && createdAtMatch && updatedAtMatch && updateByMatch;
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
    this.checkerGroups = this.refineData(dataFromBody);
  }

  protected refineData(data: ICheckerGroup[]): ICheckerGroup[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: ICheckerGroup[] | null): ICheckerGroup[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.checkerGroupService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
