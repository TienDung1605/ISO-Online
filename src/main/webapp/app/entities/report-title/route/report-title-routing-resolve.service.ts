import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReportTitle } from '../report-title.model';
import { ReportTitleService } from '../service/report-title.service';

const reportTitleResolve = (route: ActivatedRouteSnapshot): Observable<null | IReportTitle> => {
  const id = route.params['id'];
  if (id) {
    return inject(ReportTitleService)
      .find(id)
      .pipe(
        mergeMap((reportTitle: HttpResponse<IReportTitle>) => {
          if (reportTitle.body) {
            return of(reportTitle.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default reportTitleResolve;
