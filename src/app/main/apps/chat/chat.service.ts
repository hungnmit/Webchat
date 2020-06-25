import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { FuseUtils } from '@fuse/utils';
import { environment } from 'environments/environment.prod';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from 'app/_services';

@Injectable()
export class ChatService implements Resolve<any>
{
    contacts: any[];
    chats: any[];
    user: any;
    onChatSelected: BehaviorSubject<any>;
    onContactSelected: BehaviorSubject<any>;
    onChatsUpdated: Subject<any>;
    onUserUpdated: Subject<any>;
    onLeftSidenavViewChanged: Subject<any>;
    onRightSidenavViewChanged: Subject<any>;
    socket: any;
    onContactUpdate: Subject<any>;
    headers: any;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private cookieService: CookieService,
        private authenticateService: AuthenticationService
    ) {
        // Set the defaults
        this.onChatSelected = new BehaviorSubject(null);
        this.onContactSelected = new BehaviorSubject(null);
        this.onChatsUpdated = new Subject();
        this.onUserUpdated = new Subject();
        this.onLeftSidenavViewChanged = new Subject();
        this.onRightSidenavViewChanged = new Subject();
        this.onContactUpdate = new Subject();

    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getContacts(),
                this.getChats(),
                this.getUser()
            ]).then(
                ([contacts, chats, user]) => {
                    this.contacts = contacts;
                    this.chats = chats;
                    this.user = user;

                    // console.log(user);
                    this.socket = io(environment.SOCKET_URL, { query: `agentID=${user.id}` });
                    this.getContactsFromAPI();

                    this.headers = {
                        'x-access-token':
                            this.authenticateService.currentUserValue.token
                    };
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get chat
     *
     * @param contactId
     * @returns {Promise<any>}
     */
    getChat(contactId): Promise<any> {
        const chatItem = this.user.chatList.find((item) => {
            return item.contactId === contactId;
        });

        // Create new chat, if it's not created yet.
        if (!chatItem) {
            this.createNewChat(contactId).then((newChats) => {
                this.getChat(contactId);
            });
            return;
        }

        return new Promise((resolve, reject) => {

            // remove unread number and current chat
            const chatList = this.user.chatList;
            for (const item of chatList) {
                item.currentChat = false;
            }
            if (chatList && chatList.length > 0) {
                const ct = chatList.find(c => c.contactId === contactId);
                if (ct) {
                    ct.unread = null;
                    ct.currentChat = true;
                }
            }


            // get conversation 
            this._httpClient.post(environment.API_URL + '/conversation/get', { conversationID: contactId }, this.headers)
                .subscribe((response: any) => {
                    console.log(response);
                    // const chat = response;
                    const chatContact = this.contacts.find((contact) => {
                        return contact.contactId === contactId;
                    });

                    // tslint:disable-next-line: prefer-const
                    // tslint:disable-next-line: no-var-keyword
                    var dialog = [];
                    if (response && response.result) {
                        for (const item of response.result) {
                            dialog.push({
                                who: item.Direct === 'I' ? item.Sender : this.user.id,
                                message: item.Content,
                                time: item.DateReceived
                            });
                        }
                        dialog = dialog.reverse();
                    }
                    const chatData = {
                        chatId: contactId,
                        dialog,
                        contact: chatContact
                    };
                    this.onChatSelected.next({ ...chatData });
                });
        });

    }

    /**
     * Create new chat
     *
     * @param contactId
     * @returns {Promise<any>}
     */
    createNewChat(contactId): Promise<any> {
        return new Promise((resolve, reject) => {

            const contact = this.contacts.find((item) => {
                return item.id === contactId;
            });

            const chatId = FuseUtils.generateGUID();

            const chat = {
                id: chatId,
                dialog: []
            };

            const chatListItem = {
                contactId: contactId,
                id: chatId,
                lastMessageTime: '2017-02-18T10:30:18.931Z',
                name: contact.name,
                unread: null
            };

            // Add new chat list item to the user's chat list
            this.user.chatList.push(chatListItem);

            // Post the created chat
            this._httpClient.post('api/chat-chats', { ...chat })
                .subscribe((response: any) => {

                    // Post the new the user data
                    this._httpClient.post('api/chat-user/' + this.user.id, this.user)
                        .subscribe(newUserData => {

                            // Update the user data from server
                            this.getUser().then(updatedUser => {
                                this.onUserUpdated.next(updatedUser);
                                resolve(updatedUser);
                            });
                        });
                }, reject);
        });
    }

    /**
     * Select contact
     *
     * @param contact
     */
    selectContact(contact): void {
        this.onContactSelected.next(contact);
    }

    /**
     * Set user status
     *
     * @param status
     */
    setUserStatus(status): void {
        this.user.status = status;

    }

    /**
     * Update user data
     *
     * @param userData
     */
    updateUserData(userData): void {
        this._httpClient.post('api/chat-user/' + this.user.id, userData)
            .subscribe((response: any) => {
                this.user = userData;
            }
            );
    }

    /**
     * Update the chat dialog
     *
     * @param chatId
     * @param dialog
     * @returns {Promise<any>}
     */
    updateDialog(chatId, dialog): Promise<any> {
        return new Promise((resolve, reject) => {

            const newData = {
                id: chatId,
                dialog: dialog
            };

            this._httpClient.post('api/chat-chats/' + chatId, newData)
                .subscribe(updatedChat => {
                    resolve(updatedChat);
                }, reject);
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/chat-contacts')
                .subscribe((response: any) => {
                    // resolve(response);
                    resolve([]);
                }, reject);
        });
    }

    getTransferContacts(data): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.API_URL + '/contactmessage/' + data.contactMessageID, this.headers)
                .subscribe((response: any) => {
                    if (response) {
                        const { ContactMessageID, SenderName } = response;
                        this.contacts.push({
                            id: ContactMessageID,
                            name: SenderName,
                            status: 'online',
                            unread: 1
                        });
                    }
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get chats
     *
     * @returns {Promise<any>}
     */
    getChats(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/chat-chats')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get user
     *
     * @returns {Promise<any>}
     */
    getUser(): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const user = {
                id: this.authenticateService.currentUserValue.username,
                name: 'khoa',
                avatar: 'assets/images/avatars/profile.jpg',
                chatList: []
            };

            resolve(user);


        });
    }

    emit(event: string, data: any): void {
        this.socket.emit(event, data);
    }
    on(event: string, cb): void {
        this.socket.on(event, data => {
            cb(data);
        });
    }

    addContact(contact: any): void {
        // console.log(contact)
        // this.contacts.push(contact);
        // this.user.chatList.push(contact);
        this.addElementInArray(contact, this.contacts);
        this.addElementInArray(contact, this.user.chatList);
        // update subcribe
        this.onContactUpdate.next(contact);
    }

    addElementInArray(contact, arr): void {
        if (arr.length > 0) {
            const index = arr.findIndex(x => x.contactId === contact.contactId);
            if (index === -1) {
                arr.push(contact);
            }
        }
        else {
            arr.push(contact);
        }
    }

    removeElementFromArray(id, arr): any {
        const indexChatList = arr.findIndex(x => x.contactId === id);
        if (indexChatList > -1) {
            arr.splice(indexChatList, 1);
        }
        return arr;
    }

    setUnreadStatus(contactId, value = 0): void {
        const contact = this.user.chatList.find(x => x.contactId === contactId);
        // console.log(contact);
        if (contact) {
            if (!contact.unread) {
                contact.unread = 1;
            }
            else {
                contact.unread++;
            }
            if (value === -1) {
                contact.unread = null;
            }
        }
        else {
            console.log('Not found anotherContact: ' + contactId);
        }
    }

    completeConversation(contact): void {

        const { contactId } = contact;
        const data = {
            contactMessageID: contactId,
            agentID: this.user.id
        };
        this.emit(environment.COMPLETE_CONVERSATION, data);
        this.user.chatList = this.removeElementFromArray(contactId, this.user.chatList);
        // auto change to next window if exist
        if (this.user.chatList && this.user.chatList.length > 0) {
            this.getChat(this.user.chatList[0].contactId);
        }
        else {
            this.onChatSelected.next(null);
        }

    }

    async getContactsFromAPI(): Promise<any> {
        // var chatList = [];
        const { API_URL } = environment;

        const resp: any = await this._httpClient.get(API_URL + '/token/' + this.user.id).toPromise();
        console.log(resp);
        if (resp && resp.result) {
            for (const item of resp.result) {

                const { ContactMessageID, SenderName } = item;
                const contact = {
                    chatId: ContactMessageID,
                    contactId: ContactMessageID,
                    status: 'online',
                    name: SenderName,
                    avatar: 'assets/images/avatars/profile.jpg'
                };
                this.addContact(contact);
            }
        }
    }

    closeSocket(): void {
        if (this.socket) {
            this.socket.close();
        }
    }

    async updateAgentStatus(online): Promise<any> {
        const { API_URL } = environment;

        const response = this._httpClient.post(API_URL + '/online', {
            agentID: this.user.id,
            online
        }, { headers: this.headers }).toPromise();

    }

    

}

