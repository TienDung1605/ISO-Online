import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PartsComponent } from './list/parts.component';
import { PartsDetailComponent } from './detail/parts-detail.component';
import { PartsUpdateComponent } from './update/parts-update.component';
import PartsResolve from './route/parts-routing-resolve.service';

const partsRoute: Routes = [
  {
    path: '',
    component: PartsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartsDetailComponent,
    resolve: {
      parts: PartsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartsUpdateComponent,
    resolve: {
      parts: PartsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartsUpdateComponent,
    resolve: {
      parts: PartsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default partsRoute;
