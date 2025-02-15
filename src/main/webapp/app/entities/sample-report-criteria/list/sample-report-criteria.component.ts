import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { ISampleReportCriteria } from '../sample-report-criteria.model';
import { EntityArrayResponseType, SampleReportCriteriaService } from '../service/sample-report-criteria.service';
import { SampleReportCriteriaDeleteDialogComponent } from '../delete/sample-report-criteria-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-sample-report-criteria',
  templateUrl: './sample-report-criteria.component.html',
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
export class SampleReportCriteriaComponent implements OnInit {
  subscription: Subscription | null = null;
  sampleReportCriteria?: ISampleReportCriteria[];
  isLoading = false;

  sortState = sortStateSignal({});

  public router = inject(Router);
  protected sampleReportCriteriaService = inject(SampleReportCriteriaService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: ISampleReportCriteria): number =>
    this.sampleReportCriteriaService.getSampleReportCriteriaIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.sampleReportCriteria || this.sampleReportCriteria.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(sampleReportCriteria: ISampleReportCriteria): void {
    const modalRef = this.modalService.open(SampleReportCriteriaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sampleReportCriteria = sampleReportCriteria;
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
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.sampleReportCriteria = this.refineData(dataFromBody);
  }

  protected refineData(data: ISampleReportCriteria[]): ISampleReportCriteria[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: ISampleReportCriteria[] | null): ISampleReportCriteria[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.sampleReportCriteriaService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
