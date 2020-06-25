import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role } from '../_models';

const users: User[] = [
    { auth: true, username: 'admin', role: Role.Admin },
    { auth: true, username: 'user', role: Role.User }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions
        // function authenticate() {
        //     const { username, password } = body;
        //     const user = users.find(x => x.username === username && x.password === password);
        //     if (!user) return error('Username or password is incorrect');
        //     return ok({
        //         id: user.id,
        //         username: user.username,
        //         firstName: user.firstName,
        //         lastName: user.lastName,
        //         role: user.role,
        //         token: `fake-jwt-token.${user.id}`
        //     });
        // }
        
        function authenticate() {
            const { username, auth } = body;
            const user = users.find(x => x.username === username && x.auth === auth);
            if (!user) return error('Username or password is incorrect');
            return ok({
                auth: user.auth,
                username: user.username,
                role: user.role,
                token: user.token
            })
        }

        // function getUsers() {
        //     if (!isLoggedIn()) return unauthorized();
        //     return ok(users);
        // }

        // function getUserById() {
        //     if (!isLoggedIn()) return unauthorized();

        //     // only admins can access other user records
        //     if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

        //     const user = users.find(x => x.id === idFromUrl());
        //     return ok(user);
        // }

        function getUsers() {
            if (!isAdmin()) return unauthorized();
            return ok(users);
        }


        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        // function isLoggedIn() {
        //     return headers.get('Authorization') === 'Bearer fake-jwt-token';
        // }

        function isLoggedIn() {
            return headers.get('x-access-token') === 'Bearer fake-jwt-token';
        }

        function isAdmin() {
            return isLoggedIn() && currentUser().role === Role.Admin;
        }

        // function currentUser() {
        //     if (!isLoggedIn()) return;
        //     const id = parseInt(headers.get('Authorization').split('.')[1]);
        //     return users.find(x => x.id === id);
        // }

        function currentUser() {
            if (!isLoggedIn()) return;
            const username = headers.get('x-access-token').split('.')[1];
            return users.find(x => x.username === username);
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};