import { Routes } from '@angular/router';
import { PlanGroupComponent } from './list/plan-group.component';
import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import planGroupResolve from './route/plan-group-routing-resolve.service';

const grossScriptRoute: Routes = [
  {
    path: '',
    component: PlanGroupComponent,
    resolve: {
      plan: planGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/list',
    component: PlanGroupComponent,
    resolve: {
      plan: planGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default grossScriptRoute;
