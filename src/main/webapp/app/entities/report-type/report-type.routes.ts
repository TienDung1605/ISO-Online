import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ReportTypeComponent } from './list/report-type.component';
import { ReportTypeDetailComponent } from './detail/report-type-detail.component';
import { ReportTypeUpdateComponent } from './update/report-type-update.component';
import ReportTypeResolve from './route/report-type-routing-resolve.service';

const reportTypeRoute: Routes = [
  {
    path: '',
    component: ReportTypeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReportTypeDetailComponent,
    resolve: {
      reportType: ReportTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReportTypeUpdateComponent,
    resolve: {
      reportType: ReportTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReportTypeUpdateComponent,
    resolve: {
      reportType: ReportTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reportTypeRoute;
