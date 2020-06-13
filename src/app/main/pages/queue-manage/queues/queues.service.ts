import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Queue } from './queue.model';
import { environment } from 'environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ManageQueuesService implements Resolve<any>
{
    queues: any[];
    onQueuesChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onQueuesChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getQueues()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */
    getQueues(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get<Queue[]>(`${environment.API_URL}/queue`)
                .subscribe((response: any) => {
                    this.queues = response['result'];
                    this.onQueuesChanged.next(this.queues);
                    resolve(response);
                }, reject);
        });
    }

    deleteQueue(idqueue): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.delete<Queue[]>(`${environment.API_URL}/queue/` + idqueue)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
