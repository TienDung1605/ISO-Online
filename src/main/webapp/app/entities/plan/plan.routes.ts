import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PlanComponent } from './list/plan.component';
import { PlanDetailComponent } from './detail/plan-detail.component';
import { PlanUpdateComponent } from './update/plan-update.component';
import PlanResolve from './route/plan-routing-resolve.service';

const planRoute: Routes = [
  {
    path: '',
    component: PlanComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlanDetailComponent,
    resolve: {
      plan: PlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlanUpdateComponent,
    resolve: {
      plan: PlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlanUpdateComponent,
    resolve: {
      plan: PlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default planRoute;
