import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EvaluatorComponent } from './list/evaluator.component';
import { EvaluatorDetailComponent } from './detail/evaluator-detail.component';
import { EvaluatorUpdateComponent } from './update/evaluator-update.component';
import EvaluatorResolve from './route/evaluator-routing-resolve.service';

const evaluatorRoute: Routes = [
  {
    path: '',
    component: EvaluatorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EvaluatorDetailComponent,
    resolve: {
      evaluator: EvaluatorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EvaluatorUpdateComponent,
    resolve: {
      evaluator: EvaluatorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EvaluatorUpdateComponent,
    resolve: {
      evaluator: EvaluatorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default evaluatorRoute;
