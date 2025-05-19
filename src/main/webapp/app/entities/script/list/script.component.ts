import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IScript } from '../script.model';
import { EntityArrayResponseType, ScriptService } from '../service/script.service';
import { ScriptDeleteDialogComponent } from '../delete/script-delete-dialog.component';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'jhi-script',
  templateUrl: './script.component.html',
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
    ButtonModule,
  ],
})
export class ScriptComponent implements OnInit {
  subscription: Subscription | null = null;
  scripts?: IScript[];
  isLoading = false;

  sortState = sortStateSignal({});
  scriptResult: any[] = [];
  page = 1;
  totalItems = 0;
  selectedPageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;
  filters = {
    scriptCode: '',
    scriptName: '',
    timeStart: '',
    timeEnd: '',
    status: '',
    updateBy: '',
  };
  public router = inject(Router);
  protected scriptService = inject(ScriptService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: IScript): number => this.scriptService.getScriptIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.scripts || this.scripts.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(script: IScript): void {
    const modalRef = this.modalService.open(ScriptDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.script = script;
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
          this.scripts = res.body;
          this.scriptResult = [...this.scripts];
          this.totalRecords = this.scripts.length;
          this.isLoading = false;
        }
      },
    });
  }

  searchTable(): void {
    if (!this.scripts) {
      return;
    }
    this.scriptResult = this.scripts.filter(script => {
      const startDate = script.timeStart ? new Date(script.timeStart.toDate()).toISOString().split('T')[0] : '';
      const endDate = script.timeEnd ? new Date(script.timeEnd.toDate()).toISOString().split('T')[0] : '';
      const searchCreatedDate = this.filters.timeStart ? new Date(this.filters.timeStart).toISOString().split('T')[0] : '';
      const searchUpdatedDate = this.filters.timeEnd ? new Date(this.filters.timeEnd).toISOString().split('T')[0] : '';

      return (
        (!this.filters.scriptCode || script.scriptCode?.toLowerCase().includes(this.filters.scriptCode.toLowerCase())) &&
        (!this.filters.scriptName || script.scriptName?.toString().includes(this.filters.scriptName)) &&
        (!this.filters.timeStart || startDate === searchCreatedDate) &&
        (!this.filters.timeEnd || endDate === searchUpdatedDate) &&
        (!this.filters.status || script.status?.toString().includes(this.filters.status)) &&
        (!this.filters.updateBy || script.updateBy?.toLowerCase().includes(this.filters.updateBy.toLowerCase()))
      );
    });
    this.totalRecords = this.scripts.length;
  }
  onSearch(script: keyof typeof this.filters, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters[script] = value;
    this.searchTable();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.load();
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
    this.scripts = this.refineData(dataFromBody);
  }

  protected refineData(data: IScript[]): IScript[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IScript[] | null): IScript[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.scriptService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
