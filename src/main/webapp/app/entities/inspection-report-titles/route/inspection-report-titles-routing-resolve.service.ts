import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInspectionReportTitles } from '../inspection-report-titles.model';
import { InspectionReportTitlesService } from '../service/inspection-report-titles.service';

const inspectionReportTitlesResolve = (route: ActivatedRouteSnapshot): Observable<null | IInspectionReportTitles> => {
  const id = route.params['id'];
  if (id) {
    return inject(InspectionReportTitlesService)
      .find(id)
      .pipe(
        mergeMap((inspectionReportTitles: HttpResponse<IInspectionReportTitles>) => {
          if (inspectionReportTitles.body) {
            return of(inspectionReportTitles.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default inspectionReportTitlesResolve;
