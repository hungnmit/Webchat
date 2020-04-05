import { Role } from './role';

export class User {
    auth: boolean;
    //id: number;
    username: string;
    role: Role;
    error?: string;
    token?: string;
}