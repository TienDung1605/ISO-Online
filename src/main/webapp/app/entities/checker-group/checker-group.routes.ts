import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CheckerGroupComponent } from './list/checker-group.component';
import { CheckerGroupDetailComponent } from './detail/checker-group-detail.component';
import { CheckerGroupUpdateComponent } from './update/checker-group-update.component';
import CheckerGroupResolve from './route/checker-group-routing-resolve.service';

const checkerGroupRoute: Routes = [
  {
    path: '',
    component: CheckerGroupComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CheckerGroupDetailComponent,
    resolve: {
      checkerGroup: CheckerGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CheckerGroupUpdateComponent,
    resolve: {
      checkerGroup: CheckerGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CheckerGroupUpdateComponent,
    resolve: {
      checkerGroup: CheckerGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default checkerGroupRoute;
