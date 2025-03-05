import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { FieldsComponent } from './list/fields.component';
import { FieldsDetailComponent } from './detail/fields-detail.component';
import { FieldsUpdateComponent } from './update/fields-update.component';
import FieldsResolve from './route/fields-routing-resolve.service';

const fieldsRoute: Routes = [
  {
    path: '',
    component: FieldsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FieldsDetailComponent,
    resolve: {
      fields: FieldsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FieldsUpdateComponent,
    resolve: {
      fields: FieldsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FieldsUpdateComponent,
    resolve: {
      fields: FieldsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default fieldsRoute;
