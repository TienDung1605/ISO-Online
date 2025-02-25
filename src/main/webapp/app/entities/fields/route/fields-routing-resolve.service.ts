import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFields } from '../fields.model';
import { FieldsService } from '../service/fields.service';

const fieldsResolve = (route: ActivatedRouteSnapshot): Observable<null | IFields> => {
  const id = route.params['id'];
  if (id) {
    return inject(FieldsService)
      .find(id)
      .pipe(
        mergeMap((fields: HttpResponse<IFields>) => {
          if (fields.body) {
            return of(fields.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default fieldsResolve;
