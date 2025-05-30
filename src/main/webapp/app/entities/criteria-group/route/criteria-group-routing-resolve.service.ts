import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICriteriaGroup } from '../criteria-group.model';
import { CriteriaGroupService } from '../service/criteria-group.service';

const criteriaGroupResolve = (route: ActivatedRouteSnapshot): Observable<null | ICriteriaGroup> => {
  const id = route.params['id'];
  if (id) {
    return inject(CriteriaGroupService)
      .find(id)
      .pipe(
        mergeMap((criteriaGroup: HttpResponse<ICriteriaGroup>) => {
          if (criteriaGroup.body) {
            return of(criteriaGroup.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default criteriaGroupResolve;
