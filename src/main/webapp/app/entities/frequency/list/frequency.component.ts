import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IFrequency } from '../frequency.model';
import { EntityArrayResponseType, FrequencyService } from '../service/frequency.service';
import { FrequencyDeleteDialogComponent } from '../delete/frequency-delete-dialog.component';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'jhi-frequency',
  templateUrl: './frequency.component.html',
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
    TagModule,
  ],
})
export class FrequencyComponent implements OnInit {
  subscription: Subscription | null = null;
  frequencies?: IFrequency[];
  isLoading = false;
  frequencyResult: any[] = [];
  sortState = sortStateSignal({});
  page = 1;
  totalItems = 0;
  selectedPageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;
  filters = {
    name: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
    status: '',
  };

  public router = inject(Router);
  protected frequencyService = inject(FrequencyService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: IFrequency): number => this.frequencyService.getFrequencyIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.frequencies || this.frequencies.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(frequency: IFrequency): void {
    const modalRef = this.modalService.open(FrequencyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.frequency = frequency;
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
          this.frequencies = res.body;
          this.frequencyResult = [...this.frequencies];
          this.totalRecords = this.frequencies.length;
          this.isLoading = false;
        }
      },
    });
  }

  searchTable(): void {
    if (!this.frequencies) {
      return;
    }

    this.frequencyResult = this.frequencies.filter(frequency => {
      const createdDate = frequency.createdAt ? new Date(frequency.createdAt.toDate()).toISOString().split('T')[0] : '';
      const updatedDate = frequency.updatedAt ? new Date(frequency.updatedAt.toDate()).toISOString().split('T')[0] : '';
      const searchCreatedDate = this.filters.createdAt ? new Date(this.filters.createdAt).toISOString().split('T')[0] : '';
      const searchUpdatedDate = this.filters.updatedAt ? new Date(this.filters.updatedAt).toISOString().split('T')[0] : '';

      return (
        (!this.filters.name || frequency.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.createdAt || createdDate === searchCreatedDate) &&
        (!this.filters.updatedAt || updatedDate === searchUpdatedDate) &&
        (!this.filters.status || frequency.status?.toString().includes(this.filters.status)) &&
        (!this.filters.updateBy || frequency.updateBy?.toLowerCase().includes(this.filters.updateBy.toLowerCase()))
      );
    });
    this.totalRecords = this.frequencyResult.length;
  }

  onSearch(frequency: keyof typeof this.filters, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters[frequency] = value;
    this.searchTable();
  }

  onPageSizeChange(event: any): void {
    this.selectedPageSize = event.rows;
    this.first = event.first;
  }

  getSeverity(status: string): any {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'DEACTIVATE':
        return 'danger';
    }
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.frequencies = this.refineData(dataFromBody);
  }

  protected refineData(data: IFrequency[]): IFrequency[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IFrequency[] | null): IFrequency[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.frequencyService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
