import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TitleComponent } from './list/title.component';
import { TitleDetailComponent } from './detail/title-detail.component';
import { TitleUpdateComponent } from './update/title-update.component';
import TitleResolve from './route/title-routing-resolve.service';

const titleRoute: Routes = [
  {
    path: '',
    component: TitleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TitleDetailComponent,
    resolve: {
      title: TitleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TitleUpdateComponent,
    resolve: {
      title: TitleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TitleUpdateComponent,
    resolve: {
      title: TitleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default titleRoute;
