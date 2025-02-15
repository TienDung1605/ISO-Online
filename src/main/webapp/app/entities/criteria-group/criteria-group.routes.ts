import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CriteriaGroupComponent } from './list/criteria-group.component';
import { CriteriaGroupDetailComponent } from './detail/criteria-group-detail.component';
import { CriteriaGroupUpdateComponent } from './update/criteria-group-update.component';
import CriteriaGroupResolve from './route/criteria-group-routing-resolve.service';

const criteriaGroupRoute: Routes = [
  {
    path: '',
    component: CriteriaGroupComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CriteriaGroupDetailComponent,
    resolve: {
      criteriaGroup: CriteriaGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CriteriaGroupUpdateComponent,
    resolve: {
      criteriaGroup: CriteriaGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CriteriaGroupUpdateComponent,
    resolve: {
      criteriaGroup: CriteriaGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default criteriaGroupRoute;
