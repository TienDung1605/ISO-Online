import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParts } from '../parts.model';
import { PartsService } from '../service/parts.service';

const partsResolve = (route: ActivatedRouteSnapshot): Observable<null | IParts> => {
  const id = route.params['id'];
  if (id) {
    return inject(PartsService)
      .find(id)
      .pipe(
        mergeMap((parts: HttpResponse<IParts>) => {
          if (parts.body) {
            return of(parts.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default partsResolve;
