import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class ManageService {
    constructor(private http: HttpClient) {
    }

    public get GetAgentIDs() {
        var list = [];
        var arrayData = [];
        this.http.get<string[]>(`${environment.API_URL}/agentids`).subscribe(
            data => {
                arrayData = data['result'];
                arrayData.forEach(e =>{
                    list.push(e.id);
                })            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error occured.");
                    return false
                } else {
                    console.log("Server-side error occured.");
                    return false
                }
            });
            return list;
    };

    public get GetQueueIDs() {
        var list = [];
        var arrayData = [];
        this.http.get<string[]>(`${environment.API_URL}/queueids`).subscribe(
            data => {
                //console.log(data)
                arrayData = data['result'];
                arrayData.forEach(e =>{
                    list.push(e.id);
                })
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    console.log("Server-side error occured.");
                }
            });
            return list;
    };
}