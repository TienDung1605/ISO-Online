import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISource } from '../source.model';
import { SourceService } from '../service/source.service';

const sourceResolve = (route: ActivatedRouteSnapshot): Observable<null | ISource> => {
  const id = route.params['id'];
  if (id) {
    return inject(SourceService)
      .find(id)
      .pipe(
        mergeMap((source: HttpResponse<ISource>) => {
          if (source.body) {
            return of(source.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default sourceResolve;
