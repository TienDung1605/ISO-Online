import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IReportType } from '../report-type.model';
import { EntityArrayResponseType, ReportTypeService } from '../service/report-type.service';
import { ReportTypeDeleteDialogComponent } from '../delete/report-type-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-report-type',
  templateUrl: './report-type.component.html',
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
export class ReportTypeComponent implements OnInit {
  subscription: Subscription | null = null;
  reportTypes?: IReportType[];
  isLoading = false;

  sortState = sortStateSignal({});
  reportType: IReportType[] = [];
  filteredReportTypes: IReportType[] = [];
  searchTerms: { [key: string]: string } = {
    id: '',
    name: '',
    code: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
  };

  page = 1;
  pageSize = 10;
  totalItems = 0;

  public router = inject(Router);
  protected reportTypeService = inject(ReportTypeService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: IReportType): number => this.reportTypeService.getReportTypeIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.reportTypes || this.reportTypes.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(reportType: IReportType): void {
    const modalRef = this.modalService.open(ReportTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.reportType = reportType;
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
    this.reportTypeService
      .query({
        page: this.page - 1,
        size: this.pageSize,
        sort: this.sortState(),
      })
      .subscribe(respone => {
        this.filteredReportTypes = respone.body ?? [];
        this.reportTypes = [...this.filteredReportTypes];
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
    this.reportTypes = this.filteredReportTypes.filter(reportType => {
      const nameMatch =
        !this.searchTerms.name || (reportType.name && reportType.name.toLowerCase().includes(this.searchTerms.name.toLowerCase()));

      const codeMatch =
        !this.searchTerms.code || (reportType.code && reportType.code.toLowerCase().includes(this.searchTerms.code.toLowerCase()));

      const statusMatch = !this.searchTerms.status || (reportType.status && reportType.status.toString().includes(this.searchTerms.status));

      const createdAtMatch =
        !this.searchTerms.createdAt || (reportType.createdAt && reportType.createdAt.toString().includes(this.searchTerms.createdAt));

      const updatedAtMatch =
        !this.searchTerms.updatedAt || (reportType.updatedAt && reportType.updatedAt.toString().includes(this.searchTerms.updatedAt));

      const updateByMatch =
        !this.searchTerms.updateBy ||
        (reportType.updateBy && reportType.updateBy.toLowerCase().includes(this.searchTerms.updateBy.toLowerCase()));

      return nameMatch && codeMatch && statusMatch && createdAtMatch && updatedAtMatch && updateByMatch;
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
    this.reportTypes = this.refineData(dataFromBody);
  }

  protected refineData(data: IReportType[]): IReportType[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IReportType[] | null): IReportType[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.reportTypeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
