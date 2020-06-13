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

import { ManageAgentsComponent } from 'app/main/pages/agent-manage/agents/agents.component';
import { ManageAgentsService } from 'app/main/pages/agent-manage/agents/agents.service';
import { ManageAgentComponent } from 'app/main/pages/agent-manage/agent/agent.component';
import { ManageAgentService } from 'app/main/pages/agent-manage/agent/agent.service';
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
import { ContactsModule } from './contacts/contacts.module';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactsContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactsMainSidebarComponent } from './contacts/sidebars/main/main.component';
import { ContactsSelectedBarComponent } from './contacts/selected-bar/selected-bar.component';
import { ContactsContactFormDialogComponent } from './contacts/contact-form/contact-form.component';
import { ContactsService } from './contacts/contacts.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
//import { MaterialFileInputModule } from 'ngx-material-file-input';

const routes: Routes = [
    {
        path     : 'agents',
        component: ManageAgentsComponent,
        resolve  : {
            data: ManageAgentsService,ContactsService
        },
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path     : 'agents/:id',
        component: ManageAgentComponent,
        resolve  : {
            data: ManageAgentService,ContactsService
        },
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path     : 'agents/:id/:handle',
        component: ManageAgentComponent,
        resolve  : {
            data: ManageAgentService,ContactsService
        },
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    // {
    //     path: 'queueinagent',
    //     loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule)
    // },
    {
        path     : 'agents/queue',
        loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule)
        // component: ContactsComponent,
        // resolve  : {
        //     contacts: ContactsService
        // }
    }
    // {
    //     path     : 'orders',
    //     component: EcommerceOrdersComponent,
    //     resolve  : {
    //         data: EcommerceOrdersService
    //     },
    //     canActivate: [AuthGuard],
    //     data: { roles: [Role.Admin] }
    // },
    // {
    //     path     : 'orders/:id',
    //     component: EcommerceOrderComponent,
    //     resolve  : {
    //         data: EcommerceOrderService
    //     },
    //     canActivate: [AuthGuard],
    //     data: { roles: [Role.Admin] }
    // }
];

@NgModule({
    declarations: [
        ManageAgentsComponent,
        ManageAgentComponent,
        // EcommerceOrdersComponent,
        // EcommerceOrderComponent

        ContactsComponent,
        ContactsContactListComponent,
        ContactsSelectedBarComponent,
        ContactsMainSidebarComponent,
        ContactsContactFormDialogComponent
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
        //ContactsModule,

        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

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
        ManageAgentsService,
        ManageAgentService,
        // EcommerceOrdersService,
        // EcommerceOrderService       
    ],
    entryComponents: [
        ContactsContactFormDialogComponent
    ]
})
export class AgentManageModule
{
}
