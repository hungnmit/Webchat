import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.prod';
import { User } from '../_models';

//User service chứa một method để lấy tất cả người dùng từ api.
@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.API_URL}/users`);
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.API_URL}/users/${id}`);
    }
}