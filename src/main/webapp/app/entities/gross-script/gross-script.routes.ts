import { Routes } from '@angular/router';
import { GrossScriptComponent } from './gross-script.component';
import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const grossScriptRoute: Routes = [
  {
    path: '',
    component: GrossScriptComponent,
    data: {
      defaultSort: 'id' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  // {
  //   path: 'new',
  //   component: GrossScriptComponent,
  //   data: {
  //     defaultSort: 'id' + ASC,
  //   },
  //   canActivate: [UserRouteAccessService]
  // }
];

export default grossScriptRoute;
