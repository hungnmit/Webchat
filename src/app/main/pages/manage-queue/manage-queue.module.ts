import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManageQueueComponent } from './manage-queue.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatIconModule } from '@angular/material/icon';

import { AuthGuard } from '../../../_helpers';
import { Role } from '../../../_models';
import { QueueFormDialogComponent } from './queue-form/queue-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule, FuseConfirmDialogModule } from '@fuse/components';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes = [
  {
      path     : 'manage-queue',
      component: ManageQueueComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  }
];

@NgModule({
  declarations: [
    ManageQueueComponent,    
    QueueFormDialogComponent,
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
  providers: [
  ],
  entryComponents: [
    QueueFormDialogComponent
  ]
})
export class ManageQueueModule { }
