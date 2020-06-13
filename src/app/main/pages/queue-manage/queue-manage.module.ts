import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { ManageQueuesComponent } from 'app/main/pages/queue-manage/queues/queues.component';
import { ManageQueuesService } from 'app/main/pages/queue-manage/queues/queues.service';
import { ManageQueueComponent } from 'app/main/pages/queue-manage/queue/queue.component';
import { ManageQueueService } from 'app/main/pages/queue-manage/queue/queue.service';
// import { EcommerceOrdersComponent } from 'app/main/pages/e-commerce/orders/orders.component';
// import { EcommerceOrdersService } from 'app/main/pages/e-commerce/orders/orders.service';
// import { EcommerceOrderComponent } from 'app/main/pages/e-commerce/order/order.component';
// import { EcommerceOrderService } from 'app/main/pages/e-commerce/order/order.service';
import { AuthGuard } from '../../../_helpers';
import { Role } from '../../../_models';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { InfosComponent } from './infos/infos.component';
import { InfosInfoListComponent } from './infos/info-list/info-list.component';
import { InfosSelectedBarComponent } from './infos/info-selected-bar/info-selected-bar.component';
import { InfosMainSidebarComponent } from './infos/sidebars/main/info-main.component';
//import { MaterialFileInputModule } from 'ngx-material-file-input';
import { InfosService } from './infos/infos.service';
import { InfosModule } from './infos/infos.module';

const routes: Routes = [
    {
        path     : 'queues',
        component: ManageQueuesComponent,
        resolve  : {
            data: ManageQueuesService,InfosService
        },
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path     : 'queues/:id',
        component: ManageQueueComponent,
        resolve  : {
            data: ManageQueueService,InfosService
        },
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path     : 'queues/:id/:handle',
        component: ManageQueueComponent,
        resolve  : {
            data: ManageQueueService,InfosService
        },
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path     : 'queues/agent',
        loadChildren: () => import('./infos/infos.module').then(m => m.InfosModule)
    }
];

@NgModule({
    declarations: [
        ManageQueuesComponent,
        ManageQueueComponent,
        // EcommerceOrdersComponent,
        // EcommerceOrderComponent

        InfosComponent,
        InfosInfoListComponent,
        InfosSelectedBarComponent,
        InfosMainSidebarComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatChipsModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatDatepickerModule,
        //InfosModule,

        NgxChartsModule,

        FuseSharedModule,
        FuseWidgetModule,


        MatMenuModule,
        MatToolbarModule,
        //MaterialFileInputModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers   : [
        ManageQueuesService,
        ManageQueueService,
        // EcommerceOrdersService,
        // EcommerceOrderService       
    ],
    entryComponents: [
        //InfosInfoFormDialogComponent
    ]
})
export class QueueManageModule
{
}
