import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IReport } from '../report.model';
import { EntityArrayResponseType, ReportService } from '../service/report.service';
import { ReportDeleteDialogComponent } from '../delete/report-delete-dialog.component';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SampleReportService } from 'app/entities/sample-report/service/sample-report.service';
import { ReportTypeService } from 'app/entities/report-type/service/report-type.service';
import { PlanService } from 'app/entities/plan/service/plan.service';

@Component({
  standalone: true,
  selector: 'jhi-report',
  templateUrl: './report.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    PaginatorModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
  ],
})
export class ReportComponent implements OnInit {
  subscription: Subscription | null = null;
  reports?: IReport[];
  isLoading = false;

  sortState = sortStateSignal({});
  reportResult: any[] = [];
  page = 1;
  totalItems = 0;
  itemsPerPage = 10;

  selectedPageSize: number = 10;
  rows = 10;

  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;

  filters = {
    id: '',
    name: '',
    code: '',
    sampleReportId: '',
    status: '',
    testOfObject: '',
    checker: '',
    frequency: '',
    reportType: '',
    reportTypeId: '',
    planId: '',
    scoreScale: '',

    user: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
  };
  public router = inject(Router);
  protected reportService = inject(ReportService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  protected sampleReportService = inject(SampleReportService);
  protected reportTypeService = inject(ReportTypeService);
  protected planService = inject(PlanService);

  trackId = (_index: number, item: IReport): number => this.reportService.getReportIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.reports || this.reports.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(report: IReport): void {
    const modalRef = this.modalService.open(ReportDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.report = report;
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
          this.reports = res.body;
          this.reportResult = [...this.reports];
          this.sampleReportService.query().subscribe(res1 => {
            if (res1.body) {
              this.reports?.forEach(sampleReport => {
                const result = res1.body!.find((item: any) => item.id === sampleReport.sampleReportId);
              });
            }
            console.log('result', this.reportResult);
          });
        }
      },
    });
  }

  searchTable(): void {
    if (!this.reports) {
      return;
    }

    this.reportResult = this.reports.filter(
      item =>
        (!this.filters.name || item.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.code || item.code?.toLowerCase().includes(this.filters.code.toLowerCase())) &&
        (!this.filters.sampleReportId || item.sampleReportId?.toString().includes(this.filters.sampleReportId)) &&
        (!this.filters.createdAt || item.createdAt?.toString().includes(this.filters.createdAt)) &&
        (!this.filters.updatedAt || item.updatedAt?.toString().includes(this.filters.updatedAt)) &&
        (!this.filters.testOfObject || item.testOfObject?.toLowerCase().includes(this.filters.testOfObject.toLowerCase())) &&
        (!this.filters.checker || item.checker?.toLowerCase().includes(this.filters.checker.toLowerCase())) &&
        (!this.filters.status || item.status?.toLowerCase().includes(this.filters.status.toLowerCase())) &&
        (!this.filters.scoreScale || item.scoreScale?.toLowerCase().includes(this.filters.scoreScale.toLowerCase())),
    );
    this.totalRecords = this.reportResult.length;
  }

  onSearch(report: keyof typeof this.filters, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters[report] = value;
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
    this.reports = this.refineData(dataFromBody);
  }

  protected refineData(data: IReport[]): IReport[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IReport[] | null): IReport[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.reportService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
