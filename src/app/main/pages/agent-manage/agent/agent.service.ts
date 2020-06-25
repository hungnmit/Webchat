import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { Agent } from './agent.model';

@Injectable()
export class ManageAgentService implements Resolve<any>
{
    routeParams: any;
    agent: any;
    onAgentChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onAgentChanged = new BehaviorSubject({});
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
                this.onAgentChanged.next(false);
                resolve(false);
            }
            else {
                this._httpClient.get<Agent[]>(`${environment.API_URL}/agent/` + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.agent = response['result'];
                        this.onAgentChanged.next(this.agent);
                        resolve(response);
                    }, reject);
            }
        });
    }

    /**
     * Save product
     *
     * @param agent
     * @returns {Promise<any>}
     */
    saveAgent(agent): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(`${environment.API_URL}/agent/` + agent.id, agent)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add product
     *
     * @param agent
     * @returns {Promise<any>}
     */
    addAgent(agent): Promise<any> {
        return new Promise((resolve, reject) => {
            // this._httpClient.post('api/e-commerce-products/', product)
            //     .subscribe((response: any) => {
            //         resolve(response);
            //     }, reject);
            this._httpClient.post<Agent[]>(`${environment.API_URL}/agent`, agent)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
