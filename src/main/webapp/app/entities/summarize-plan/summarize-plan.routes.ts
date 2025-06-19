import { Routes } from '@angular/router';
import { SummarizePlanComponent } from './summarize-plan.component';
import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import planResolve from '../plan/route/plan-routing-resolve.service';

const summarizePlanRoute: Routes = [
  {
    path: ':id',
    component: SummarizePlanComponent,
    resolve: {
      plan: planResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default summarizePlanRoute;
