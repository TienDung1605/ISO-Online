import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFrequency } from '../frequency.model';
import { FrequencyService } from '../service/frequency.service';

const frequencyResolve = (route: ActivatedRouteSnapshot): Observable<null | IFrequency> => {
  const id = route.params['id'];
  if (id) {
    return inject(FrequencyService)
      .find(id)
      .pipe(
        mergeMap((frequency: HttpResponse<IFrequency>) => {
          if (frequency.body) {
            return of(frequency.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default frequencyResolve;
