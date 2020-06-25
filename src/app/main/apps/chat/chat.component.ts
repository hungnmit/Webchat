import { Component, OnDestroy, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, window } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { ChatService } from 'app/main/apps/chat/chat.service';
import { AuthenticationService } from 'app/_services';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod'

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ChatComponent implements OnInit, OnDestroy {
    selectedChat: any;
    blinkInterval: any;

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

        this._chatService.on(environment.USER_SEND_AGENT, data => {
            const contact = this._chatService.contacts.find(c => c.chatId === data.contactMessageID);
            console.log(`COntact: ${JSON.stringify(this._chatService.contacts)},,,, ${data.contactMessageID}`);
            if (contact) {
                this._chatService.setUnreadStatus(data.contactMessageID);
                this.playSound();
                this.blink('New message', contact.name, 700);
            }

        });



    }

    @HostListener('window:focus', ['$event'])
    onFocus(event): void {
        this.setDefaultTitle();
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


    playSound(): void {
        const audio = new Audio();
        audio.src = '../../../../../assets/sound/messenger.mp3';
        audio.load();
        audio.play();
    }

    blink(title1, title2, timeout): void {
        const title = document.title;
        title2 = title2 || title;
        timeout = timeout || 1000;

        document.title = title1;
        clearInterval(this.blinkInterval);
        this.blinkInterval = setInterval(() => {
            if (document.title === title1) {
                document.title = title2;
            } else {
                document.title = title1;
            }
        }, timeout);
    }

    setDefaultTitle(): void {
        clearInterval(this.blinkInterval);
        document.title = 'Web App Chatbot';
    }
}
