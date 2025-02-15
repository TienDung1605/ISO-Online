import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ConvertComponent } from './list/convert.component';
import { ConvertDetailComponent } from './detail/convert-detail.component';
import { ConvertUpdateComponent } from './update/convert-update.component';
import ConvertResolve from './route/convert-routing-resolve.service';

const convertRoute: Routes = [
  {
    path: '',
    component: ConvertComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConvertDetailComponent,
    resolve: {
      convert: ConvertResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConvertUpdateComponent,
    resolve: {
      convert: ConvertResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConvertUpdateComponent,
    resolve: {
      convert: ConvertResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default convertRoute;
