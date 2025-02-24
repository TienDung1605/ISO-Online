import { Routes } from '@angular/router';
import { InspectionReportComponent } from './inspection-report.component';
import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const inspectionReportRoute: Routes = [
  {
    path: '',
    component: InspectionReportComponent,
    data: {
      defaultSort: 'id' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default inspectionReportRoute;
