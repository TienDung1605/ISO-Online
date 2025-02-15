import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ReportCriteriaComponent } from './list/report-criteria.component';
import { ReportCriteriaDetailComponent } from './detail/report-criteria-detail.component';
import { ReportCriteriaUpdateComponent } from './update/report-criteria-update.component';
import ReportCriteriaResolve from './route/report-criteria-routing-resolve.service';

const reportCriteriaRoute: Routes = [
  {
    path: '',
    component: ReportCriteriaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReportCriteriaDetailComponent,
    resolve: {
      reportCriteria: ReportCriteriaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReportCriteriaUpdateComponent,
    resolve: {
      reportCriteria: ReportCriteriaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReportCriteriaUpdateComponent,
    resolve: {
      reportCriteria: ReportCriteriaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reportCriteriaRoute;
