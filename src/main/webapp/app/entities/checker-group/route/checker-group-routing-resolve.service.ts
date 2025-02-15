import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICheckerGroup } from '../checker-group.model';
import { CheckerGroupService } from '../service/checker-group.service';

const checkerGroupResolve = (route: ActivatedRouteSnapshot): Observable<null | ICheckerGroup> => {
  const id = route.params['id'];
  if (id) {
    return inject(CheckerGroupService)
      .find(id)
      .pipe(
        mergeMap((checkerGroup: HttpResponse<ICheckerGroup>) => {
          if (checkerGroup.body) {
            return of(checkerGroup.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default checkerGroupResolve;
