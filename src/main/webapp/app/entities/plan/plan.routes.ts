import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PlanComponent } from './list/plan.component';
import { PlanDetailComponent } from './detail/plan-detail.component';
import { PlanUpdateComponent } from './update/plan-update.component';
import PlanResolve from './route/plan-routing-resolve.service';
import { GrossScriptComponent } from './gross-script/gross-script.component';
import { InspectionReportComponent } from './inspection-report/inspection-report.component';
import reportResolve from '../report/route/report-routing-resolve.service';
import { InspectionPlanComponent } from './inspection-plan/inspection-plan.component';
import { SummarizePlanComponent } from './summarize-plan/summarize-plan.component';

const planRoute: Routes = [
  {
    path: '',
    component: PlanComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlanDetailComponent,
    resolve: {
      plan: PlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlanUpdateComponent,
    resolve: {
      plan: PlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlanUpdateComponent,
    resolve: {
      plan: PlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/gross-script',
    component: GrossScriptComponent,
    resolve: {
      plan: PlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/inspection-report',
    component: InspectionReportComponent,
    resolve: {
      report: reportResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/inspection-plan',
    component: InspectionPlanComponent,
    resolve: {
      plan: PlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/summarize-plan',
    component: SummarizePlanComponent,
    resolve: {
      plan: PlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default planRoute;
