import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ReportTitleComponent } from './list/report-title.component';
import { ReportTitleDetailComponent } from './detail/report-title-detail.component';
import { ReportTitleUpdateComponent } from './update/report-title-update.component';
import ReportTitleResolve from './route/report-title-routing-resolve.service';

const reportTitleRoute: Routes = [
  {
    path: '',
    component: ReportTitleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReportTitleDetailComponent,
    resolve: {
      reportTitle: ReportTitleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReportTitleUpdateComponent,
    resolve: {
      reportTitle: ReportTitleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReportTitleUpdateComponent,
    resolve: {
      reportTitle: ReportTitleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reportTitleRoute;
