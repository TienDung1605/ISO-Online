import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ScriptComponent } from './list/script.component';
import { ScriptDetailComponent } from './detail/script-detail.component';
import { ScriptUpdateComponent } from './update/script-update.component';
import ScriptResolve from './route/script-routing-resolve.service';

const scriptRoute: Routes = [
  {
    path: '',
    component: ScriptComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScriptDetailComponent,
    resolve: {
      script: ScriptResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScriptUpdateComponent,
    resolve: {
      script: ScriptResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScriptUpdateComponent,
    resolve: {
      script: ScriptResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default scriptRoute;
