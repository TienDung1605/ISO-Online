import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CheckLevelComponent } from './list/check-level.component';
import { CheckLevelDetailComponent } from './detail/check-level-detail.component';
import { CheckLevelUpdateComponent } from './update/check-level-update.component';
import CheckLevelResolve from './route/check-level-routing-resolve.service';

const checkLevelRoute: Routes = [
  {
    path: '',
    component: CheckLevelComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CheckLevelDetailComponent,
    resolve: {
      checkLevel: CheckLevelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CheckLevelUpdateComponent,
    resolve: {
      checkLevel: CheckLevelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CheckLevelUpdateComponent,
    resolve: {
      checkLevel: CheckLevelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default checkLevelRoute;
