import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { Queue } from './queue.model';

@Injectable()
export class ManageQueueService implements Resolve<any>
{
    routeParams: any;
    queue: any;
    onQueueChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onQueueChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProduct()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get product
     *
     * @returns {Promise<any>}
     */
    getProduct(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onQueueChanged.next(false);
                resolve(false);
            }
            else {
                this._httpClient.get<Queue[]>(`${environment.API_URL}/queue/` + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.queue = response['result'];
                        this.onQueueChanged.next(this.queue);
                        resolve(response);
                    }, reject);
            }
        });
    }

    /**
     * Save product
     *
     * @param queue
     * @returns {Promise<any>}
     */
    saveQueue(queue): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(`${environment.API_URL}/queue/` + queue.id, queue)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add product
     *
     * @param queue
     * @returns {Promise<any>}
     */
    addQueue(queue): Promise<any> {
        return new Promise((resolve, reject) => {
            // this._httpClient.post('api/e-commerce-products/', product)
            //     .subscribe((response: any) => {
            //         resolve(response);
            //     }, reject);
            this._httpClient.post<Queue[]>(`${environment.API_URL}/queue`, queue)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
