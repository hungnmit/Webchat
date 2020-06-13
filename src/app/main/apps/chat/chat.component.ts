import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { ChatService } from 'app/main/apps/chat/chat.service';
import { AuthenticationService } from 'app/_services';
import { Router } from '@angular/router';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ChatComponent implements OnInit, OnDestroy {
    selectedChat: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     */
    constructor(
        private _chatService: ChatService,
        private authenticationService: AuthenticationService,
        private router: Router,
    ) {
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
        // redirect to chat if logged is not admin
        if (this.authenticationService.isAdmin) {
            this.router.navigate(['/pages/agents']);
        }
        console.log(`agent: ${JSON.stringify(this._chatService.user)}`);
        this._chatService.updateAgentStatus(true);
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
                this.selectedChat = chatData;
            });

        // window.addEventListener('beforeunload', (e) => {
        //     alert(123);
        //     const { user } = this._chatService;

        //     if (user && user.chatList && user.chatList.length > 0) {
        //         const result = confirm('Are you sure to disconnect with current contacts?');
        //         if (result) {
        //             user.chatList.forEach(element => {
        //                 this._chatService.completeConversation(element.contactId);
        //             });
        //             this._chatService.updateAgentStatus(false);
        //             this._chatService.closeSocket();
        //         }
        //     }
        // });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._chatService.updateAgentStatus(false);
        this._chatService.closeSocket();
    }
}
