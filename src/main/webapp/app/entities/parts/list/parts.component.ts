import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IParts } from '../parts.model';
import { EntityArrayResponseType, PartsService } from '../service/parts.service';
import { PartsDeleteDialogComponent } from '../delete/parts-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-parts',
  templateUrl: './parts.component.html',
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
export class PartsComponent implements OnInit {
  subscription: Subscription | null = null;
  parts?: IParts[];
  isLoading = false;
  sortState = sortStateSignal({});
  part: IParts[] = [];
  filteredParts: IParts[] = [];
  searchTerms: { [key: string]: string } = {
    id: '',
    name: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
  };

  page = 1;
  pageSize = 10;
  totalItems = 0;

  public router = inject(Router);
  protected partsService = inject(PartsService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: IParts): number => this.partsService.getPartsIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.parts || this.parts.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(parts: IParts): void {
    const modalRef = this.modalService.open(PartsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.parts = parts;
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
    this.partsService
      .query({
        page: this.page - 1,
        size: this.pageSize,
        sort: this.sortState(),
      })
      .subscribe(respone => {
        this.filteredParts = respone.body ?? [];
        this.parts = [...this.filteredParts];
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
    this.parts = this.filteredParts.filter(part => {
      const nameMatch = !this.searchTerms.name || (part.name && part.name.toLowerCase().includes(this.searchTerms.name.toLowerCase()));

      const statusMatch =
        !this.searchTerms.status || (part.status && part.status.toLowerCase().includes(this.searchTerms.status.toLowerCase()));

      const createdAtMatch =
        !this.searchTerms.createdAt || (part.createdAt && part.createdAt.toString().includes(this.searchTerms.createdAt));

      const updatedAtMatch =
        !this.searchTerms.updatedAt || (part.updatedAt && part.updatedAt.toString().includes(this.searchTerms.updatedAt));

      const updateByMatch =
        !this.searchTerms.updateBy || (part.updateBy && part.updateBy.toLowerCase().includes(this.searchTerms.updateBy.toLowerCase()));

      return nameMatch && statusMatch && createdAtMatch && updatedAtMatch && updateByMatch;
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
    this.parts = this.refineData(dataFromBody);
  }

  protected refineData(data: IParts[]): IParts[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IParts[] | null): IParts[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.partsService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
