import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEvaluator } from '../evaluator.model';
import { EvaluatorService } from '../service/evaluator.service';

const evaluatorResolve = (route: ActivatedRouteSnapshot): Observable<null | IEvaluator> => {
  const id = route.params['id'];
  if (id) {
    return inject(EvaluatorService)
      .find(id)
      .pipe(
        mergeMap((evaluator: HttpResponse<IEvaluator>) => {
          if (evaluator.body) {
            return of(evaluator.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default evaluatorResolve;
