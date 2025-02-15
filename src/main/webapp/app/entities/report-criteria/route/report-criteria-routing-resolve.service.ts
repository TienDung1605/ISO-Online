import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReportCriteria } from '../report-criteria.model';
import { ReportCriteriaService } from '../service/report-criteria.service';

const reportCriteriaResolve = (route: ActivatedRouteSnapshot): Observable<null | IReportCriteria> => {
  const id = route.params['id'];
  if (id) {
    return inject(ReportCriteriaService)
      .find(id)
      .pipe(
        mergeMap((reportCriteria: HttpResponse<IReportCriteria>) => {
          if (reportCriteria.body) {
            return of(reportCriteria.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default reportCriteriaResolve;
