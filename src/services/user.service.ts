import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
    user;
    token;
    myIndex = 0;
    constructor(
    ) {

    }

    setUserLogin(user) {
        this.user = user;
    }

    setUserToken(token) {
        this.token = token;
    }

    getUserLogin() {
        return this.user;
    }

    getUserToken() {
        return this.token;
    }

    destroyUserLogin() {
        this.user = null;
    }



}