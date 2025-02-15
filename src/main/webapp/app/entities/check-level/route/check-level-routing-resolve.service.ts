import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICheckLevel } from '../check-level.model';
import { CheckLevelService } from '../service/check-level.service';

const checkLevelResolve = (route: ActivatedRouteSnapshot): Observable<null | ICheckLevel> => {
  const id = route.params['id'];
  if (id) {
    return inject(CheckLevelService)
      .find(id)
      .pipe(
        mergeMap((checkLevel: HttpResponse<ICheckLevel>) => {
          if (checkLevel.body) {
            return of(checkLevel.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default checkLevelResolve;
