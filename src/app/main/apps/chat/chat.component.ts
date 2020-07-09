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
        // audio.src = '../../../../../assets/sound/messenger.mp3';
        // tslint:disable-next-line: max-line-length
        audio.src = 'https://public.bn.files.1drv.com/y4mrMtdCkdvuriagOSn0fQ3isbpEX0pQ3NDt46wLHf8TA1wk5fAEppDFWhVDxB6fdTcXEEq7oZIBT69S1gwNLM29OCn47l3aMwtbxf8xCetcC9na8vkY2AnHACkFZDALvotGot3eNBkCWFCyO45eEroA9b3JaMZSbeVCo1RCsWVqdBkuID2KwZe_3n_0KmgNPey4j2iELqYAGdT-bQ8fDqdV02SgS-7gIlfsfPMxy0-Lz4?access_token=EwAAA61DBAAUzl/nWKUlBg14ZGcybuC4/OHFdfEAAezc684NfRunbfeDid60gwSYtoFgVr0zCq9ijHAllG9hBHYSvwlz9c6OJxjPePuS2X8xuMR59gn%2bsjanFyCBp6y8nhujwA6zu8Ee/rKKJ51aJ0U5SAQnp00RsWDPel2Ksn7P8jGce101hyS76XN8udpq6T4xG0vJ9A4Lf8NQPqA83N32GdCjVECxhzGkZWShn5Oz3MLWSOpC3YvINQtPy3OnaB7R5HpVbxEWS27T5cXElMJ4N6OB76Iz8q0utOn206vztH8FV5xOm6LLkK0feyDY8CdEOMoEoOcFal2iTkrkYi2/eJmoqp6WyYTOdsQRTFZOoOCJiMUEtSizVseyjFUDZgAACOByXItUw8%2bc0AFwwOkRgTAvu0JB3/sfNuQGCsoV%2btrwsXBmsccQRWuW%2bF8PwczKjFQCQsKaTDQjinQxZvxkmmS9xiuSkZPKjzeaLVOU9Sf8p%2bLm61xh7MMROnLJuloCLQ%2bwkJ2jkd00chUesJWAcjRsj6u5jf3vG88ee%2bCD5OOcbaoWdTVDvgZZjuBUi0O4RXr%2bEu%2bpu2cLvdA8ZQTMW10AoRlEyK%2bsx6xzA8CNWF/B5rLG/nGWaXX7TfLhEIzpHjGCJ5ORfolet%2bPFUJT5BUfHCPPHyy7%2biPwIhB4BN69%2bleWQXth%2bxVxtNJ95naJZoYO7jd/AKoHeRXDisQZR%2bMob1Vva1nuFZdWaBbXbmM7yDS%2bTruOW0oIn9d3abbwh/pTR7heToePxwkXHVXvTT7vVfR8HTbN%2bsC1bzR0hKkY/aduEqfHL4uquoTM0Xvtn6TfHDaHUrxSDyb48rtx6eNBO3BPFtI/WKQTa70h8WJNavvLJafAf00jf8MDmXhiV%2bYqWJWANxhB9j4Vfan7mZKCysG6tvp4O5k6kcb8G0gA1vqoKs%2b39SRhwTBxKSligWeJnAtV7pxQEZABn3qJqvNBVCqBhCbL2dfFPEARxI35Pa4Xiuh66DA%2bFwg0C';
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
