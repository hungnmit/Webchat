import { NgModule } from '@angular/core';

import { LoginModule } from 'app/main/pages/authentication/login/login.module';
import { Login2Module } from 'app/main/pages/authentication/login-2/login-2.module';
import { RegisterModule } from 'app/main/pages/authentication/register/register.module';
import { Register2Module } from 'app/main/pages/authentication/register-2/register-2.module';
import { ForgotPasswordModule } from 'app/main/pages/authentication/forgot-password/forgot-password.module';
import { ForgotPassword2Module } from 'app/main/pages/authentication/forgot-password-2/forgot-password-2.module';
import { ResetPasswordModule } from 'app/main/pages/authentication/reset-password/reset-password.module';
import { ResetPassword2Module } from 'app/main/pages/authentication/reset-password-2/reset-password-2.module';
import { LockModule } from 'app/main/pages/authentication/lock/lock.module';
import { MailConfirmModule } from 'app/main/pages/authentication/mail-confirm/mail-confirm.module';
//import { ComingSoonModule } from 'app/main/pages/coming-soon/coming-soon.module';
import { Error404Module } from 'app/main/pages/errors/404/error-404.module';
import { Error500Module } from 'app/main/pages/errors/500/error-500.module';
//import { InvoiceModernModule } from 'app/main/pages/invoices/modern/modern.module';
//import { InvoiceCompactModule } from 'app/main/pages/invoices/compact/compact.module';
//import { MaintenanceModule } from 'app/main/pages/maintenance/maintenence.module';
//import { PricingModule } from 'app/main/pages/pricing/pricing.module';
//import { ProfileModule } from 'app/main/pages/profile/profile.module';
//import { SearchClassicModule } from 'app/main/pages/search/classic/search-classic.module';
//import { SearchModernModule } from 'app/main/pages/search/modern/search-modern.module';
//import { FaqModule } from 'app/main/pages/faq/faq.module';
//import { KnowledgeBaseModule } from 'app/main/pages/knowledge-base/knowledge-base.module';
import { ManageQueueModule } from 'app/main/pages/manage-queue/manage-queue.module';
import { ManageAgentModule } from 'app/main/pages/manage-agent/manage-agent.module';

import { JwtInterceptor, ErrorInterceptor } from '../../_helpers';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgentManageModule } from 'app/main/pages/agent-manage/agent-manage.module';
import { ContactsModule } from './agent-manage/contacts/contacts.module';
import { QueueManageModule } from './queue-manage/queue-manage.module';
import { InfosModule } from './queue-manage/infos/infos.module';
@NgModule({
    imports: [
        // Authentication
        LoginModule,
        Login2Module,
        // RegisterModule,
        // Register2Module,
        // ForgotPasswordModule,
        // ForgotPassword2Module,
        // ResetPasswordModule,
        // ResetPassword2Module,
        // LockModule,
        // MailConfirmModule,

        // Coming-soon
        //ComingSoonModule,

        // Errors
        // Error404Module,
        // Error500Module,

        // Invoices
        // InvoiceModernModule,
        // InvoiceCompactModule,

        // // Maintenance
        // MaintenanceModule,

        // // Pricing
        // PricingModule,

        // // Profile
        // ProfileModule,

        // // Search
        // SearchClassicModule,
        // SearchModernModule,

        // // Faq
        // FaqModule,

        // // Knowledge base
        // KnowledgeBaseModule,
        //ManageQueueModule,
        //ManageAgentModule,
        QueueManageModule,
        AgentManageModule,
        ContactsModule,
        InfosModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // provider used to create fake backend
    ],
})
export class PagesModule
{

}
