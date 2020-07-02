import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './apps/contacts/contacts.component';
import { ContactsSelectedBarComponent } from './apps/contacts/selected-bar/selected-bar.component';
import { ContactsContactListComponent } from './apps/contacts/contact-list/contact-list.component';
import { ContactsMainSidebarComponent } from './apps/contacts/sidebars/main/main.component';
import { ContactsContactFormDialogComponent } from './apps/contacts/contact-form/contact-form.component';
import { InfosComponent } from './apps/infos/infos.component';
import { InfosInfoListComponent } from './apps/infos/info-list/info-list.component';
import { InfosSelectedBarComponent } from './apps/infos/info-selected-bar/info-selected-bar.component';
import { InfosMainSidebarComponent } from './apps/infos/sidebars/main/info-main.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { ContactsModule } from './apps/contacts/contacts.module';

@NgModule({
  imports:[
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
        FuseSidebarModule,
        
  ],
  declarations:[
    // ContactsComponent,
    // ContactsContactListComponent,
    // ContactsSelectedBarComponent,
    // ContactsMainSidebarComponent,
    // ContactsContactFormDialogComponent,

    // InfosComponent,
    // InfosInfoListComponent,
    // InfosSelectedBarComponent,
    // InfosMainSidebarComponent,

  ],
  exports:[
    // ContactsComponent,
    // ContactsContactListComponent,
    // ContactsSelectedBarComponent,
    // ContactsMainSidebarComponent,
    // ContactsContactFormDialogComponent,

    // InfosComponent,
    // InfosInfoListComponent,
    // InfosSelectedBarComponent,
    // InfosMainSidebarComponent,
  ]
})
export class Common_moduleModule {
}
