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
  ],
})
export class CriteriaComponent implements OnInit {
  subscription: Subscription | null = null;
  criteria?: ICriteria[];
  isLoading = false;

  sortState = sortStateSignal({});
  criterias: ICriteria[] = [];
  filteredCriteria: ICriteria[] = [];

  searchTerms: { [key: string]: string } = {
    name: '',
    criterialGroupId: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
  };

  page: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  public router = inject(Router);
  protected criteriaService = inject(CriteriaService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

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
    this.criteriaService
      .query({
        page: this.page - 1,
        size: this.pageSize,
        sort: this.sortState(),
      })
      .subscribe({
        next: response => {
          this.filteredCriteria = response.body ?? [];
          this.criteria = [...this.filteredCriteria];
          this.totalItems = Number(response.headers.get('X-Total-Count'));
        },
      });
  }

  onPageChange(page: number): void {
    if (!Number.isNaN(page) && page > 0) {
      this.page = page;
      console.log('Valid page number:', this.page);
      this.load();
    } else {
      console.error('Invalid page number:', page);
      this.page = 1;
      this.load();
    }
  }

  // onPageSizeChange(event: Event): void {
  //   const target = event.target as HTMLSelectElement;
  //   this.pageSize = Number(target.value);
  //   this.page = 1;
  //   this.load();
  //   console.log('Page size changed to:', this.pageSize);
  // }
  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (!target) {
      console.error('Invalid event target');
      return;
    }

    const newSize = parseInt(target.value, 10);
    if (isNaN(newSize) || newSize <= 0) {
      console.error('Invalid page size:', target.value);
      this.pageSize = 10;
    } else {
      this.pageSize = newSize;
    }

    console.log('Page size changed to:', this.pageSize);
    this.page = 1;
    this.load();
  }

  // searchTable(): void {
  //   this.criteria = this.filteredCriteria.filter(convert => {
  //     const nameMatch = !this.searchTerms.name ||
  //       (convert.name && convert.name.toLowerCase().includes(this.searchTerms.name.toLowerCase()));

  //     const criterialGroupIdMatch = !this.searchTerms.criterialGroupId ||
  //       (convert.criterialGroupId && convert.criterialGroupId.toLowerCase().includes(this.searchTerms.criterialGroupId.toLowerCase()));

  //     const statusMatch = !this.searchTerms.status ||
  //       (convert.status && convert.status.toString().includes(this.searchTerms.status));

  //     const createdAtMatch = !this.searchTerms.createdAt ||
  //       (convert.createdAt && convert.createdAt.toString().includes(this.searchTerms.createdAt));

  //     const updatedAtMatch = !this.searchTerms.updatedAt ||
  //       (convert.updatedAt && convert.updatedAt.toString().includes(this.searchTerms.updatedAt));

  //     const updateByMatch = !this.searchTerms.updateBy ||
  //       (convert.updateBy && convert.updateBy.toLowerCase().includes(this.searchTerms.updateBy.toLowerCase()));

  //     return nameMatch && criterialGroupIdMatch && statusMatch && createdAtMatch &&
  //       updatedAtMatch && updateByMatch;
  //   });
  // }

  searchTable(): void {
    this.criteria = this.filteredCriteria.filter(
      criteria =>
        (!this.searchTerms.name || criteria.name?.toLowerCase().includes(this.searchTerms.name.toLowerCase())) &&
        (!this.searchTerms.criterialGroupId || criteria.criterialGroupId?.toString().includes(this.searchTerms.criterialGroupId)) &&
        (!this.searchTerms.status || criteria.status?.toString().includes(this.searchTerms.status)) &&
        (!this.searchTerms.createdAt || criteria.createdAt?.toString().includes(this.searchTerms.createdAt)) &&
        (!this.searchTerms.updatedAt || criteria.updatedAt?.toString().includes(this.searchTerms.updatedAt)) &&
        (!this.searchTerms.updateBy || criteria.updateBy?.toLowerCase().includes(this.searchTerms.updateBy.toLowerCase())),
    );
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
