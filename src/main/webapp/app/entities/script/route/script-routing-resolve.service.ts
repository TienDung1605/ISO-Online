import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IScript } from '../script.model';
import { ScriptService } from '../service/script.service';

const scriptResolve = (route: ActivatedRouteSnapshot): Observable<null | IScript> => {
  const id = route.params['id'];
  if (id) {
    return inject(ScriptService)
      .find(id)
      .pipe(
        mergeMap((script: HttpResponse<IScript>) => {
          if (script.body) {
            return of(script.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default scriptResolve;
