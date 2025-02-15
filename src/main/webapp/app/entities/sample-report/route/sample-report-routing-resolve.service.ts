import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISampleReport } from '../sample-report.model';
import { SampleReportService } from '../service/sample-report.service';

const sampleReportResolve = (route: ActivatedRouteSnapshot): Observable<null | ISampleReport> => {
  const id = route.params['id'];
  if (id) {
    return inject(SampleReportService)
      .find(id)
      .pipe(
        mergeMap((sampleReport: HttpResponse<ISampleReport>) => {
          if (sampleReport.body) {
            return of(sampleReport.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default sampleReportResolve;
