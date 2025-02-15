import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITitle } from '../title.model';
import { TitleService } from '../service/title.service';

const titleResolve = (route: ActivatedRouteSnapshot): Observable<null | ITitle> => {
  const id = route.params['id'];
  if (id) {
    return inject(TitleService)
      .find(id)
      .pipe(
        mergeMap((title: HttpResponse<ITitle>) => {
          if (title.body) {
            return of(title.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default titleResolve;
