import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { FrequencyComponent } from './list/frequency.component';
import { FrequencyDetailComponent } from './detail/frequency-detail.component';
import { FrequencyUpdateComponent } from './update/frequency-update.component';
import FrequencyResolve from './route/frequency-routing-resolve.service';

const frequencyRoute: Routes = [
  {
    path: '',
    component: FrequencyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FrequencyDetailComponent,
    resolve: {
      frequency: FrequencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FrequencyUpdateComponent,
    resolve: {
      frequency: FrequencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FrequencyUpdateComponent,
    resolve: {
      frequency: FrequencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default frequencyRoute;
