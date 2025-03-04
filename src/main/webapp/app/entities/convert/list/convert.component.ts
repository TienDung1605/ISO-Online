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
  ],
})
export class ConvertComponent implements OnInit {
  subscription: Subscription | null = null;
  converts?: IConvert[];
  isLoading = false;
  sortState = sortStateSignal({});
  convert: IConvert[] = [];
  filteredConverts: IConvert[] = [];

  page = 0;
  pageSize = 10;
  totalItems = 0;

  searchTerms: { [key: string]: string } = {
    id: '',
    name: '',
    type: '',
    mark: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
    score: '',
    count: '',
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
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });

    // this.convertService.query({
    //   page: this.page,
    //   size: this.pageSize,
    //   sort: this.sortState()
    // }).subscribe(response => {
    //   this.converts = response.body ?? [];
    //   this.filteredConverts = [...this.converts];
    //   this.totalItems = Number(response.headers.get('X-Total-Count'));
    //   console.log('kq', this.converts)
    // });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.load();
    console.log('page', this.page);
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = Number(target.value);
    this.page = 1;
    setTimeout(() => {
      this.load();
    }, 100);
    console.log('page size', this.pageSize);
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  searchTable(): void {
    this.converts = this.filteredConverts.filter(convert => {
      const nameMatch =
        !this.searchTerms.name || (convert.name && convert.name.toLowerCase().includes(this.searchTerms.name.toLowerCase()));

      const typeMatch =
        !this.searchTerms.type || (convert.type && convert.type.toLowerCase().includes(this.searchTerms.type.toLowerCase()));

      const markMatch = !this.searchTerms.mark || (convert.mark && convert.mark.toString().includes(this.searchTerms.mark));

      const createdAtMatch =
        !this.searchTerms.createdAt || (convert.createdAt && convert.createdAt.toString().includes(this.searchTerms.createdAt));

      const updatedAtMatch =
        !this.searchTerms.updatedAt || (convert.updatedAt && convert.updatedAt.toString().includes(this.searchTerms.updatedAt));

      const updateByMatch =
        !this.searchTerms.updateBy ||
        (convert.updateBy && convert.updateBy.toLowerCase().includes(this.searchTerms.updateBy.toLowerCase()));

      const scoreMatch = !this.searchTerms.score || (convert.score && convert.score.toString().includes(this.searchTerms.score));

      const countMatch = !this.searchTerms.count || (convert.count && convert.count.toString().includes(this.searchTerms.count));

      return nameMatch && typeMatch && markMatch && createdAtMatch && updatedAtMatch && updateByMatch && scoreMatch && countMatch;
    });
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.converts = this.refineData(dataFromBody);
  }

  protected refineData(data: IConvert[]): IConvert[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IConvert[] | null): IConvert[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.convertService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
