import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISampleReportCriteria } from '../sample-report-criteria.model';
import { SampleReportCriteriaService } from '../service/sample-report-criteria.service';

const sampleReportCriteriaResolve = (route: ActivatedRouteSnapshot): Observable<null | ISampleReportCriteria> => {
  const id = route.params['id'];
  if (id) {
    return inject(SampleReportCriteriaService)
      .find(id)
      .pipe(
        mergeMap((sampleReportCriteria: HttpResponse<ISampleReportCriteria>) => {
          if (sampleReportCriteria.body) {
            return of(sampleReportCriteria.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default sampleReportCriteriaResolve;
