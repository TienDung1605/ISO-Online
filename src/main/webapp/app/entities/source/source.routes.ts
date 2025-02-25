import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SourceComponent } from './list/source.component';
import { SourceDetailComponent } from './detail/source-detail.component';
import { SourceUpdateComponent } from './update/source-update.component';
import SourceResolve from './route/source-routing-resolve.service';

const sourceRoute: Routes = [
  {
    path: '',
    component: SourceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SourceDetailComponent,
    resolve: {
      source: SourceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SourceUpdateComponent,
    resolve: {
      source: SourceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SourceUpdateComponent,
    resolve: {
      source: SourceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default sourceRoute;
