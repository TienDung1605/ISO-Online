import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { PlanGroupService } from '../service/plan-group.service';

const planGroupResolve = (route: ActivatedRouteSnapshot): Observable<null | any> => {
  const id = route.params['id'];
  if (id) {
    return inject(PlanGroupService)
      .find(id)
      .pipe(
        mergeMap((plan: HttpResponse<any>) => {
          if (plan.body) {
            return of(plan.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  } else {
    return inject(PlanGroupService).findAll();
  }
};

export default planGroupResolve;
