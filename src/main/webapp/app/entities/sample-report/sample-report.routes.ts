import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SampleReportComponent } from './list/sample-report.component';
import { SampleReportDetailComponent } from './detail/sample-report-detail.component';
import { SampleReportUpdateComponent } from './update/sample-report-update.component';
import SampleReportResolve from './route/sample-report-routing-resolve.service';

const sampleReportRoute: Routes = [
  {
    path: '',
    component: SampleReportComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SampleReportDetailComponent,
    resolve: {
      sampleReport: SampleReportResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SampleReportUpdateComponent,
    resolve: {
      sampleReport: SampleReportResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SampleReportUpdateComponent,
    resolve: {
      sampleReport: SampleReportResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default sampleReportRoute;
