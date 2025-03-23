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
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConvertService } from 'app/entities/convert/service/convert.service';

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
    TableModule,
    IconFieldModule,
    InputIconModule,
  ],
})
export class SampleReportComponent implements OnInit {
  subscription: Subscription | null = null;
  sampleReports?: ISampleReport[];
  isLoading = false;

  sortState = sortStateSignal({});
  sampleReportResult: any[] = [];
  page = 1;
  totalItems = 0;
  selectedPageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;
  filters = {
    name: '',
    code: '',
    createdAt: '',
    updatedAt: '',
    dataType: '',
    status: '',
    frequency: '',
    reportType: '',
    reportTypeId: '',
    updateBy: '',
  };

  public router = inject(Router);
  protected sampleReportService = inject(SampleReportService);
  protected convertSevice = inject(ConvertService);
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

    this.isLoading = true;
    this.queryBackend().subscribe({
      next: res => {
        if (res.body) {
          this.sampleReports = res.body;
          this.sampleReportResult = [...this.sampleReports];
          this.totalRecords = this.sampleReports.length;
          this.isLoading = false;
        }
        console.log('result mẫu BBKT', this.sampleReportResult);
      },
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.load();
  }

  searchTable(): void {
    if (!this.sampleReports) {
      return;
    }

    this.sampleReportResult = this.sampleReports.filter(sampleReport => {
      const createdDate = sampleReport.createdAt ? new Date(sampleReport.createdAt.toDate()).toISOString().split('T')[0] : '';
      const updatedDate = sampleReport.updatedAt ? new Date(sampleReport.updatedAt.toDate()).toISOString().split('T')[0] : '';
      const searchCreatedDate = this.filters.createdAt ? new Date(this.filters.createdAt).toISOString().split('T')[0] : '';
      const searchUpdatedDate = this.filters.updatedAt ? new Date(this.filters.updatedAt).toISOString().split('T')[0] : '';

      return (
        (!this.filters.name || sampleReport.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.code || sampleReport.code?.toString().includes(this.filters.code)) &&
        (!this.filters.createdAt || createdDate === searchCreatedDate) &&
        (!this.filters.updatedAt || updatedDate === searchUpdatedDate) &&
        (!this.filters.status || sampleReport.status?.toString().includes(this.filters.status)) &&
        (!this.filters.frequency || sampleReport.frequency?.toString().includes(this.filters.frequency)) &&
        (!this.filters.reportType || sampleReport.reportType?.toString().includes(this.filters.reportType)) &&
        (!this.filters.reportTypeId || sampleReport.reportTypeId?.toString().includes(this.filters.reportTypeId)) &&
        (!this.filters.updateBy || sampleReport.updateBy?.toLowerCase().includes(this.filters.updateBy.toLowerCase()))
      );
    });
    this.totalRecords = this.sampleReportResult.length;
  }

  onSearch(sampleReport: keyof typeof this.filters, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters[sampleReport] = value;
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
