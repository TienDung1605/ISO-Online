import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { ISampleReport } from '../sample-report.model';
import { EntityArrayResponseType, SampleReportService } from '../service/sample-report.service';
import { SampleReportDeleteDialogComponent } from '../delete/sample-report-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-sample-report',
  templateUrl: './sample-report.component.html',
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
export class SampleReportComponent implements OnInit {
  subscription: Subscription | null = null;
  sampleReports?: ISampleReport[];
  isLoading = false;

  sortState = sortStateSignal({});
  sampleReport: ISampleReport[] = [];
  filteredSampleReports: ISampleReport[] = [];
  searchTerms: { [key: string]: string } = {
    id: '',
    name: '',
    status: '',
    frequency: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
    code: '',
    reportType: '',
    reportTypeId: '',
  };

  page = 1;
  pageSize = 10;
  totalItems = 0;

  public router = inject(Router);
  protected sampleReportService = inject(SampleReportService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: ISampleReport): number => this.sampleReportService.getSampleReportIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.sampleReports || this.sampleReports.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(sampleReport: ISampleReport): void {
    const modalRef = this.modalService.open(SampleReportDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sampleReport = sampleReport;
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

    this.sampleReportService
      .query({
        page: this.page - 1,
        size: this.pageSize,
        sort: this.sortState(),
      })
      .subscribe(respone => {
        this.filteredSampleReports = respone.body ?? [];
        this.sampleReports = [...this.filteredSampleReports];
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
    this.sampleReports = this.filteredSampleReports.filter(sampleReport => {
      const nameMatch =
        !this.searchTerms.name || (sampleReport.name && sampleReport.name.toLowerCase().includes(this.searchTerms.name.toLowerCase()));

      const statusMatch =
        !this.searchTerms.status ||
        (typeof sampleReport.status === 'string' &&
          (sampleReport.status as string).toLowerCase().includes(this.searchTerms.status.toLowerCase()));

      const frequencyMatch =
        !this.searchTerms.frequency || (sampleReport.frequency && sampleReport.frequency.toString().includes(this.searchTerms.frequency));

      const createdAtMatch =
        !this.searchTerms.createdAt || (sampleReport.createdAt && sampleReport.createdAt.toString().includes(this.searchTerms.createdAt));

      const updatedAtMatch =
        !this.searchTerms.updatedAt || (sampleReport.updatedAt && sampleReport.updatedAt.toString().includes(this.searchTerms.updatedAt));

      const updateByMatch =
        !this.searchTerms.updateBy ||
        (sampleReport.updateBy && sampleReport.updateBy.toLowerCase().includes(this.searchTerms.updateBy.toLowerCase()));

      const codeMatch = !this.searchTerms.code || (sampleReport.code && sampleReport.code.toString().includes(this.searchTerms.code));

      const reportTypeMatch =
        !this.searchTerms.reportType ||
        (sampleReport.reportType && sampleReport.reportType.toString().includes(this.searchTerms.reportType));

      const reportTypeIdMatch =
        !this.searchTerms.reportTypeId ||
        (sampleReport.reportTypeId && sampleReport.reportTypeId.toString().includes(this.searchTerms.reportTypeId));

      return (
        nameMatch &&
        statusMatch &&
        frequencyMatch &&
        createdAtMatch &&
        updatedAtMatch &&
        updateByMatch &&
        codeMatch &&
        reportTypeMatch &&
        reportTypeIdMatch
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
    this.sampleReports = this.refineData(dataFromBody);
  }

  protected refineData(data: ISampleReport[]): ISampleReport[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: ISampleReport[] | null): ISampleReport[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.sampleReportService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
