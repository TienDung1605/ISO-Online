import { Routes } from '@angular/router';
import { SummarizePlanComponent } from './summarize-plan.component';
import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const summarizePlanRoute: Routes = [
  {
    path: '',
    component: SummarizePlanComponent,
    data: {
      defaultSort: 'id' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default summarizePlanRoute;
