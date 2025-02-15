import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CheckTargetComponent } from './list/check-target.component';
import { CheckTargetDetailComponent } from './detail/check-target-detail.component';
import { CheckTargetUpdateComponent } from './update/check-target-update.component';
import CheckTargetResolve from './route/check-target-routing-resolve.service';

const checkTargetRoute: Routes = [
  {
    path: '',
    component: CheckTargetComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CheckTargetDetailComponent,
    resolve: {
      checkTarget: CheckTargetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CheckTargetUpdateComponent,
    resolve: {
      checkTarget: CheckTargetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CheckTargetUpdateComponent,
    resolve: {
      checkTarget: CheckTargetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default checkTargetRoute;
