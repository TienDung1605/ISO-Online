import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IEvaluator } from '../evaluator.model';
import { EntityArrayResponseType, EvaluatorService } from '../service/evaluator.service';
import { EvaluatorDeleteDialogComponent } from '../delete/evaluator-delete-dialog.component';

import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { CheckerGroupService } from 'app/entities/checker-group/service/checker-group.service';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'jhi-evaluator',
  templateUrl: './evaluator.component.html',
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
export class EvaluatorComponent implements OnInit {
  subscription: Subscription | null = null;
  evaluators?: IEvaluator[];
  isLoading = false;
  //get list checker group
  checkerGroups: any[] | null = [];
  sortState = sortStateSignal({});
  evaluatorResult: any[] = [];

  selectedPageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  first: number = 0;
  totalRecords: number = 0;
  filters = {
    name: '',
    userGroupId: '',
    createdAt: '',
    updatedAt: '',
    updateBy: '',
    status: '',
  };

  public router = inject(Router);
  protected evaluatorService = inject(EvaluatorService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  protected checkerGroupService = inject(CheckerGroupService);
  trackId = (_index: number, item: IEvaluator): number => this.evaluatorService.getEvaluatorIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.evaluators || this.evaluators.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(evaluator: IEvaluator): void {
    const modalRef = this.modalService.open(EvaluatorDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.evaluator = evaluator;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.isLoading = true;
    this.queryBackend().subscribe({
      next: res => {
        if (res.body) {
          this.evaluators = res.body;
          this.evaluatorResult = [...this.evaluators];
          this.checkerGroupService.query().subscribe(res1 => {
            if (res1.body) {
              this.evaluators?.forEach(evaluator => {
                const result = res1.body!.find((item: any) => item.id === evaluator.userGroupId);
                if (result) {
                  evaluator.checkerGroup = result.name;
                }
              });
            }
          });
          this.totalRecords = this.evaluators.length;
          this.isLoading = false;

          console.log('result', this.evaluators);
        }
      },
    });
  }

  onPageSizeChange(event: any): void {
    this.selectedPageSize = event.rows;
    this.first = event.first;
  }

  searchTable(): void {
    if (!this.evaluators) {
      return;
    }
    this.evaluatorResult = this.evaluators.filter(evaluator => {
      const createdDate = evaluator.createdAt ? new Date(evaluator.createdAt.toDate()).toISOString().split('T')[0] : '';
      const updatedDate = evaluator.updatedAt ? new Date(evaluator.updatedAt.toDate()).toISOString().split('T')[0] : '';
      const searchCreatedDate = this.filters.createdAt ? new Date(this.filters.createdAt).toISOString().split('T')[0] : '';
      const searchUpdatedDate = this.filters.updatedAt ? new Date(this.filters.updatedAt).toISOString().split('T')[0] : '';

      return (
        (!this.filters.name || evaluator.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.userGroupId || evaluator.userGroupId?.toString().toLowerCase().includes(this.filters.userGroupId.toLowerCase())) &&
        (!this.filters.createdAt || createdDate === searchCreatedDate) &&
        (!this.filters.updatedAt || updatedDate === searchUpdatedDate) &&
        (!this.filters.status || evaluator.status?.toLowerCase().includes(this.filters.status.toLowerCase())) &&
        (!this.filters.updateBy || evaluator.updateBy?.toLowerCase().includes(this.filters.updateBy.toLowerCase()))
      );
    });
  }

  onSearch(evaluator: keyof typeof this.filters, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters[evaluator] = value;
    this.searchTable();
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
    this.evaluators = this.refineData(dataFromBody);
  }

  protected refineData(data: IEvaluator[]): IEvaluator[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IEvaluator[] | null): IEvaluator[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.evaluatorService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
