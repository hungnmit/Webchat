import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { environment } from 'environments/environment.prod';
import { Info } from './info.model';
import { Queue } from '../queue/queue.model';

@Injectable({
    providedIn: 'root'
})
export class InfosService implements Resolve<any>
{
    onInfosChanged: BehaviorSubject<any>;
    onSelectedInfosChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    infos: Info[];
    user: any;
    selectedInfos: string[] = [];
    queueId: any;
    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onInfosChanged = new BehaviorSubject([]);
        this.onSelectedInfosChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
                this.getInfos(),
                //this.getUserData(this.queueId)
            ]).then(
                ([files]) => {

                    // this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getInfos();
                    // });

                    // this.onFilterChanged.subscribe(filter => {
                    //     this.filterBy = filter;
                    //     this.getInfos();
                    // });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get infos
     *
     * @returns {Promise<any>}
     */
    getInfos(): Promise<any> {
        // return new Promise((resolve, reject) => {
        //         this._httpClient.get('api/infos-infos')
        //             .subscribe((response: any) => {

        //                 this.infos = response;

        //                 if ( this.filterBy === 'starred' )
        //                 {
        //                     this.infos = this.infos.filter(_info => {
        //                         return this.user.starred.includes(_info.id);
        //                     });
        //                 }

        //                 if ( this.filterBy === 'frequent' )
        //                 {
        //                     this.infos = this.infos.filter(_info => {
        //                         return this.user.frequentInfos.includes(_info.id);
        //                     });
        //                 }

        //                 if ( this.searchText && this.searchText !== '' )
        //                 {
        //                     this.infos = FuseUtils.filterArrayByString(this.infos, this.searchText);
        //                 }

        //                 this.infos = this.infos.map(info => {
        //                     return new Info(info);
        //                 });

        //                 this.onInfosChanged.next(this.infos);
        //                 resolve(this.infos);
        //             }, reject);
        //     }
        // );

        return new Promise((resolve, reject) => {
            //this._httpClient.get('api/infos-infos')
            this._httpClient.get<string[]>(`${environment.API_URL}/agent`)
                .subscribe((response: any) => {

                    this.infos = response['result'];

                    // if ( this.filterBy === 'starred' )
                    // {
                    //     this.infos = this.infos.filter(_info => {
                    //         return this.user.agentInQueue.includes(_info.id);
                    //     });
                    // }

                    // if ( this.filterBy === 'frequent' )
                    // {
                    //     this.infos = this.infos.filter(_info => {
                    //         return !this.user.agentInQueue.includes(_info.id);
                    //     });
                    // }

                    // if ( this.searchText && this.searchText !== '' )
                    // {
                    //     this.infos.forEach(function(v){ delete v.agentInQueue,v.dateReceived,v.online });
                    //     this.infos = FuseUtils.filterArrayByString(this.infos, this.searchText);
                    // }

                    this.infos = this.infos.map(info => {
                        return new Info(info);
                    });

                    this.onInfosChanged.next(this.infos);
                    resolve(this.infos);
                }, reject);
        }
        );
    }

    getDataFilter(filterBy): Promise<any> {
        return new Promise((resolve, reject) => {
            //this._httpClient.get('api/infos-infos')
            this._httpClient.get<string[]>(`${environment.API_URL}/agent`)
                .subscribe((response: any) => {

                    this.infos = response['result'];

                    if (filterBy === 'starred') {
                        this.infos = this.infos.filter(_info => {
                            return this.user.agentInQueue.includes(_info.id);
                        });
                    }

                    if (filterBy === 'frequent') {
                        this.infos = this.infos.filter(_info => {
                            return !this.user.agentInQueue.includes(_info.id);
                        });
                    }

                    this.infos = this.infos.map(info => {
                        return new Info(info);
                    });

                    this.onInfosChanged.next(this.infos);
                    resolve(this.infos);
                }, reject);
        }
        );
    }
    getDataSearch(searchText): Promise<any>{
        return new Promise((resolve, reject) => {
            //this._httpClient.get('api/infos-infos')
            this._httpClient.get<string[]>(`${environment.API_URL}/agent`)
                .subscribe((response: any) => {

                    this.infos = response['result'];

                    if ( searchText && searchText !== '' )
                    {
                        this.infos.forEach(function(v){ delete v.agentInQueue,v.dateReceived,v.online });
                        this.infos = FuseUtils.filterArrayByString(this.infos, searchText);
                    }

                    this.infos = this.infos.map(info => {
                        return new Info(info);
                    });

                    this.onInfosChanged.next(this.infos);
                    resolve(this.infos);
                }, reject);
        }
        );
    }
    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(queueId): Promise<any> {
        return new Promise((resolve, reject) => {
            //this._httpClient.get('api/infos-user/5725a6802d10e277a0f35724')
            // this._httpClient.get<string[]>(`${environment.API_URL}/queue`)
            //     .subscribe((response: any) => {
            //         this.user = response;
            //         this.onUserDataChanged.next(this.user);
            //         resolve(this.user);
            //     }, reject);

            this._httpClient.get<Queue[]>(`${environment.API_URL}/queue/` + queueId)
                .subscribe((response: any) => {
                    this.user = response['result'];
                    if (this.user.agentInQueue != "" && this.user.agentInQueue != null) {
                        this.user.agentInQueue = this.user.agentInQueue.split(", ");
                    }
                    else {
                        this.user.agentInQueue = ["-1"];
                    }
                    this.onUserDataChanged.next(this.user);
                    resolve(response);
                }, reject);
        }
        );
    }

    /**
     * Toggle selected info by id
     *
     * @param id
     */
    toggleSelectedInfo(id): void {
        // First, check if we already have that info as selected...
        if (this.selectedInfos.length > 0) {
            const index = this.selectedInfos.indexOf(id);

            if (index !== -1) {
                this.selectedInfos.splice(index, 1);

                // Trigger the next event
                this.onSelectedInfosChanged.next(this.selectedInfos);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedInfos.push(id);

        // Trigger the next event
        this.onSelectedInfosChanged.next(this.selectedInfos);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedInfos.length > 0) {
            this.deselectInfos();
        }
        else {
            this.selectInfos();
        }
    }

    /**
     * Select infos
     *
     * @param filterParameter
     * @param filterValue
     */
    selectInfos(filterParameter?, filterValue?): void {
        this.selectedInfos = [];

        // If there is no filter, select all infos
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedInfos = [];
            this.infos.map(info => {
                this.selectedInfos.push(info.id);
            });
        }

        // Trigger the next event
        this.onSelectedInfosChanged.next(this.selectedInfos);
    }

    /**
     * Update info
     *
     * @param info
     * @returns {Promise<any>}
     */
    updateInfo(info): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.post('api/infos-infos/' + info.id, { ...info })
                .subscribe(response => {
                    this.getInfos();
                    resolve(response);
                });
        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any> {
        if (userData.agentInQueue[0] == "-1") {
            userData.agentInQueue.splice(0, 1);
        }
        return new Promise((resolve, reject) => {
            //this._httpClient.post('api/infos-user/' + this.user.id, {...userData})
            this._httpClient.put<Queue[]>(`${environment.API_URL}/queue/` + userData.id, userData)
                .subscribe(response => {
                    this.getUserData(userData.id);
                    this.getInfos();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect infos
     */
    deselectInfos(): void {
        this.selectedInfos = [];

        // Trigger the next event
        this.onSelectedInfosChanged.next(this.selectedInfos);
    }

    /**
     * Delete info
     *
     * @param info
     */
    deleteInfo(info): void {
        const infoIndex = this.infos.indexOf(info);
        this.infos.splice(infoIndex, 1);
        this.onInfosChanged.next(this.infos);
    }

    /**
     * Delete selected infos
     */
    deleteSelectedInfos(): void {
        for (const infoId of this.selectedInfos) {
            const info = this.infos.find(_info => {
                return _info.id === infoId;
            });
            const infoIndex = this.infos.indexOf(info);
            this.infos.splice(infoIndex, 1);
        }
        this.onInfosChanged.next(this.infos);
        this.deselectInfos();
    }
}
