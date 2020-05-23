import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseMatSidenavHelperService } from '@fuse/directives/fuse-mat-sidenav/fuse-mat-sidenav.service';

import { ChatService } from 'app/main/apps/chat/chat.service';
import { environment } from 'environments/environment.prod';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'chat-chats-sidenav',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ChatChatsSidenavComponent implements OnInit, OnDestroy {
    chats: any[];
    chatSearch: any;
    contacts: any[];
    searchText: string;
    user: any;


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     * @param {FuseMatSidenavHelperService} _fuseMatSidenavHelperService
     * @param {MediaObserver} _mediaObserver
     */
    constructor(
        private _chatService: ChatService,
        private _fuseMatSidenavHelperService: FuseMatSidenavHelperService,
        public _mediaObserver: MediaObserver,
        private cookieService: CookieService
    ) {
        // Set the defaults
        this.chatSearch = {
            name: ''
        };
        this.searchText = '';

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.user = this._chatService.user;
        this.chats = this._chatService.chats;
        this.contacts = this._chatService.contacts;

        this._chatService.onChatsUpdated
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(updatedChats => {
                this.chats = updatedChats;
            });

        this._chatService.onUserUpdated
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(updatedUser => {
                this.user = updatedUser;
            });


        // this._chatService.addContact({
        //         chatId: '00421491-75c1-11ea-9816-c7ae3cdedb85|livechat',
        //         contactId: '00421491-75c1-11ea-9816-c7ae3cdedb85|livechat',
        //         lastMessageTime: '2020-04-03 22:37:39.953',
        //         status: 'online',
        //         name: 'Khoa',
        //         avatar: 'assets/images/avatars/profile.jpg'
        //         // lastMessage: 'abc xzasd'
        //     });

        this._chatService.on(environment.TRANSFER_TOKEN, (data) => {
            const { contactMessageID, name } = data;
            console.log(`transfer_token: ${contactMessageID}`);
            if (contactMessageID) {
                this._chatService.addContact({
                    chatId: contactMessageID,
                    contactId: contactMessageID,
                    status: 'online',
                    name,
                    avatar: 'assets/images/avatars/profile.jpg'
                });
               
            }
        });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get chat
     *
     * @param contact
     */
    getChat(contact): void {
        this._chatService.getChat(contact);
        
        if (!this._mediaObserver.isActive('gt-md')) {
            this._fuseMatSidenavHelperService.getSidenav('chat-left-sidenav').toggle();
        }
    }

    /**
     * Set user status
     *
     * @param status
     */
    setUserStatus(status): void {
        this._chatService.setUserStatus(status);
    }

    /**
     * Change left sidenav view
     *
     * @param view
     */
    changeLeftSidenavView(view): void {
        this._chatService.onLeftSidenavViewChanged.next(view);
    }

    /**
     * Logout
     */
    logout(): void {
        console.log('logout triggered');
    }
}
