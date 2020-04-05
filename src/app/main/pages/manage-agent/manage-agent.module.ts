import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManageAgentComponent } from './manage-agent/manage-agent.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatIconModule } from '@angular/material/icon';

import { AuthGuard } from '../../../_helpers';
import { Role } from '../../../_models';

const routes = [
  {
      path     : 'manage-agent',
      component: ManageAgentComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  }
];

@NgModule({
  declarations: [ManageAgentComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    Ng2SmartTableModule,
    MatIconModule,
  ]
})
export class ManageAgentModule { }
