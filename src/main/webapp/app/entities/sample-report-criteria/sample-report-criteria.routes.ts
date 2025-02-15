import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SampleReportCriteriaComponent } from './list/sample-report-criteria.component';
import { SampleReportCriteriaDetailComponent } from './detail/sample-report-criteria-detail.component';
import { SampleReportCriteriaUpdateComponent } from './update/sample-report-criteria-update.component';
import SampleReportCriteriaResolve from './route/sample-report-criteria-routing-resolve.service';

const sampleReportCriteriaRoute: Routes = [
  {
    path: '',
    component: SampleReportCriteriaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SampleReportCriteriaDetailComponent,
    resolve: {
      sampleReportCriteria: SampleReportCriteriaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SampleReportCriteriaUpdateComponent,
    resolve: {
      sampleReportCriteria: SampleReportCriteriaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SampleReportCriteriaUpdateComponent,
    resolve: {
      sampleReportCriteria: SampleReportCriteriaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default sampleReportCriteriaRoute;
