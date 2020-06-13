import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { InfosComponent } from 'app/main/apps/infos/infos.component';
import { InfosService } from 'app/main/apps/infos/infos.service';
import { InfosInfoListComponent } from 'app/main/apps/infos/info-list/info-list.component';
import { InfosSelectedBarComponent } from 'app/main/apps/infos/info-selected-bar/info-selected-bar.component';
import { InfosMainSidebarComponent } from 'app/main/apps/infos/sidebars/main/info-main.component';

const routes: Routes = [
    {
        path     : '**',
        component: InfosComponent,
        resolve  : {
            infos: InfosService
        }
    }
];

@NgModule({
    declarations   : [
        InfosComponent,
        InfosInfoListComponent,
        InfosSelectedBarComponent,
        InfosMainSidebarComponent,
    ],
    imports        : [
        RouterModule.forChild(routes),

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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        InfosService
    ],
    entryComponents: [
        //InfosFormDialogComponent
    ]
})
export class InfosModule
{
}
