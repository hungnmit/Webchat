import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManageAgentComponent } from './manage-agent/manage-agent.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatIconModule } from '@angular/material/icon';

import { AuthGuard } from '../../../_helpers';
import { Role } from '../../../_models';
import { MatDialogModule } from '@angular/material/dialog';
import { AgentFormDialogComponent } from './manage-agent/agent-form/agent-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatSelectModule } from '@angular/material/select';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';

const routes = [
  {
    path: 'manage-agent',
    component: ManageAgentComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  }
];

@NgModule({
  declarations: [ManageAgentComponent,
    AgentFormDialogComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    Ng2SmartTableModule,
    MatIconModule,
    MatDialogModule,

    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    SelectAutocompleteModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
  ],
  entryComponents: [
    AgentFormDialogComponent
  ]
})
export class ManageAgentModule { }
