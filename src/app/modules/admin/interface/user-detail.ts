export class UserDetail {
    id?: number;
    email?: string;
    phone?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    birthday?: any;
    gender?: string;
    address?: string;
    avatar?: number;
    createdAt?: Date;
    updateAt?: Date;
    attempts?: number;
    enabled?: boolean;
    accountNonExpired?: boolean;
    credentialsNonExpired?: boolean;
    accountNonLocked?: boolean;
}
