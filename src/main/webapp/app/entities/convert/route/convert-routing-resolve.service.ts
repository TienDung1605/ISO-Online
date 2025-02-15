import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConvert } from '../convert.model';
import { ConvertService } from '../service/convert.service';

const convertResolve = (route: ActivatedRouteSnapshot): Observable<null | IConvert> => {
  const id = route.params['id'];
  if (id) {
    return inject(ConvertService)
      .find(id)
      .pipe(
        mergeMap((convert: HttpResponse<IConvert>) => {
          if (convert.body) {
            return of(convert.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default convertResolve;
