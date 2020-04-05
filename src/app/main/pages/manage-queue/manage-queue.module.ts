import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManageQueueComponent } from './manage-queue.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatIconModule } from '@angular/material/icon';

import { AuthGuard } from '../../../_helpers';
import { Role } from '../../../_models';

const routes = [
  {
      path     : 'manage-queue',
      component: ManageQueueComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  }
];

@NgModule({
  declarations: [ManageQueueComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    Ng2SmartTableModule,
    MatIconModule,
  ],
  providers: [
  ],
})
export class ManageQueueModule { }
