import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Agent } from './agent.model';
import { environment } from 'environments/environment.prod';

@Injectable()
export class ManageAgentsService implements Resolve<any>
{
    agents: any[];
    onAgentsChanged: BehaviorSubject<any>;

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
        this.onAgentsChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getAgents()
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
    getAgents(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get<Agent[]>(`${environment.API_URL}/agent`)
                .subscribe((response: any) => {
                    this.agents = response['result'];
                    this.onAgentsChanged.next(this.agents);
                    resolve(response);
                }, reject);
        });
    }

    deleteAgent(idAagent): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.delete<Agent[]>(`${environment.API_URL}/agent/` + idAagent)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
