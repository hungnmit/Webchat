import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { User, Role } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    // tslint:disable-next-line: typedef
    public get checkCurrentUser(){
        if (this.currentUserSubject.value !== null){
            return true;
        }
        return false;
    }
    // tslint:disable-next-line: typedef
    public get isAdmin() {
        return this.currentUserValue && this.currentUserValue.role === Role.Admin;
    }

    public get getUsername(): string{
        if (this.checkCurrentUser)
        {
            return this.currentUserValue.username;
        }
        return 'agent';
    }

    public get ImageUser(): string{
        if (this.checkCurrentUser)
        {
            if (this.currentUserValue.role === Role.Admin)
            {
                return 'assets/images/avatars/Velazquez.jpg';
            }
            return 'assets/images/avatars/profile.jpg';
        }
        return 'assets/images/avatars/profile.jpg';
    }
    // login(username: string, password: string) {
    //     return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
    //         .pipe(map(user => {
    //             // store user details and jwt token in local storage to keep user logged in between page refreshes
    //             localStorage.setItem('currentUser', JSON.stringify(user));
    //             this.currentUserSubject.next(user);
    //             return user;
    //         }));
    // }

    // tslint:disable-next-line: typedef
    login(username: string, password: string) {
        return this.http.post<any>(`${environment.API_URL}/signin`, { username,  password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                if (user.error === undefined)
                {
                    user.error = '';
                    return user;
                }
                console.log(user);
                return user;
            }));
    }

    // tslint:disable-next-line: typedef
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
