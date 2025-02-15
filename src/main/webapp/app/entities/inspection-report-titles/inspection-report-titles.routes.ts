import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { InspectionReportTitlesComponent } from './list/inspection-report-titles.component';
import { InspectionReportTitlesDetailComponent } from './detail/inspection-report-titles-detail.component';
import { InspectionReportTitlesUpdateComponent } from './update/inspection-report-titles-update.component';
import InspectionReportTitlesResolve from './route/inspection-report-titles-routing-resolve.service';

const inspectionReportTitlesRoute: Routes = [
  {
    path: '',
    component: InspectionReportTitlesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InspectionReportTitlesDetailComponent,
    resolve: {
      inspectionReportTitles: InspectionReportTitlesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InspectionReportTitlesUpdateComponent,
    resolve: {
      inspectionReportTitles: InspectionReportTitlesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InspectionReportTitlesUpdateComponent,
    resolve: {
      inspectionReportTitles: InspectionReportTitlesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default inspectionReportTitlesRoute;
