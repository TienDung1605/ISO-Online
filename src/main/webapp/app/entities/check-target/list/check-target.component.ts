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
  ],
})
export class CheckTargetComponent implements OnInit {
  subscription: Subscription | null = null;
  checkTargets?: ICheckTarget[];
  isLoading = false;

  sortState = sortStateSignal({});
  filteredCheckTargets: ICheckTarget[] = [];
  public router = inject(Router);
  searchTerms: { [key: string]: string } = {
    name: '',
    inspectionTarget: '',
    evaluationLevelId: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
  };

  page = 1;
  pageSize = 10;
  totalItems = 0;

  protected checkTargetService = inject(CheckTargetService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

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
    this.checkTargetService
      .query({
        page: this.page - 1,
        size: this.pageSize,
        sort: this.sortState(),
      })
      .subscribe(response => {
        this.filteredCheckTargets = response.body ?? [];
        this.checkTargets = [...this.filteredCheckTargets];
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
    this.checkTargets = this.filteredCheckTargets.filter(convert => {
      const nameMatch =
        !this.searchTerms.name || (convert.name && convert.name.toLowerCase().includes(this.searchTerms.name.toLowerCase()));

      const inspectionTargetMatch =
        !this.searchTerms.inspectionTarget ||
        (convert.inspectionTarget && convert.inspectionTarget.toLowerCase().includes(this.searchTerms.inspectionTarget.toLowerCase()));

      const evaluationLevelIdMatch =
        !this.searchTerms.evaluationLevelId ||
        (convert.evaluationLevelId && convert.evaluationLevelId.toString().includes(this.searchTerms.evaluationLevelId));

      const statusMatch = !this.searchTerms.status || (convert.status && convert.status.toString().includes(this.searchTerms.status));

      const createdAtMatch =
        !this.searchTerms.createdAt || (convert.createdAt && convert.createdAt.toString().includes(this.searchTerms.createdAt));

      const updatedAtMatch =
        !this.searchTerms.updatedAt || (convert.updatedAt && convert.updatedAt.toString().includes(this.searchTerms.updatedAt));

      const updateByMatch =
        !this.searchTerms.updateBy ||
        (convert.updateBy && convert.updateBy.toLowerCase().includes(this.searchTerms.updateBy.toLowerCase()));

      return (
        nameMatch && inspectionTargetMatch && evaluationLevelIdMatch && statusMatch && createdAtMatch && updatedAtMatch && updateByMatch
      );
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
