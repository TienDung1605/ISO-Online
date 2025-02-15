import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICheckTarget } from '../check-target.model';
import { CheckTargetService } from '../service/check-target.service';

const checkTargetResolve = (route: ActivatedRouteSnapshot): Observable<null | ICheckTarget> => {
  const id = route.params['id'];
  if (id) {
    return inject(CheckTargetService)
      .find(id)
      .pipe(
        mergeMap((checkTarget: HttpResponse<ICheckTarget>) => {
          if (checkTarget.body) {
            return of(checkTarget.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default checkTargetResolve;
