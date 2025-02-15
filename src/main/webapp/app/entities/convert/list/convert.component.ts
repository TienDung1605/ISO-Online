import { Component, NgZone, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    TreeTableModule
  ],
})
export class ConvertComponent implements OnInit {
  subscription: Subscription | null = null;
  converts?: IConvert[];
  isLoading = false;
  treeNodes?: TreeNode[];
  planData = [
    {
      "data": {
        "name1": "Applications",
        "size": "200mb",
        "type": "Folder"
      },
      "children": [
        {
          "data": {
            "name": "Angular",
            "size": "25mb",
            "type": "Folder"
          },
          "children": [
            {
              "data": {
                "name": "angular.app",
                "size": "10mb",
                "type": "Application"
              }
            },
            {
              "data": {
                "name": "cli.app",
                "size": "10mb",
                "type": "Application"
              }
            },
            {
              "data": {
                "name": "mobile.app",
                "size": "5mb",
                "type": "Application"
              }
            }
          ]
        },
        {
          "data": {
            "name": "editor.app",
            "size": "25mb",
            "type": "Application"
          }
        },
        {
          "data": {
            "name": "settings.app",
            "size": "50mb",
            "type": "Application"
          }
        }
      ]
    }]
  sortState = sortStateSignal({});

  public router = inject(Router);
  protected convertService = inject(ConvertService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

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
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
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
