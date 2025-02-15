import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReportType } from '../report-type.model';
import { ReportTypeService } from '../service/report-type.service';

const reportTypeResolve = (route: ActivatedRouteSnapshot): Observable<null | IReportType> => {
  const id = route.params['id'];
  if (id) {
    return inject(ReportTypeService)
      .find(id)
      .pipe(
        mergeMap((reportType: HttpResponse<IReportType>) => {
          if (reportType.body) {
            return of(reportType.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default reportTypeResolve;
