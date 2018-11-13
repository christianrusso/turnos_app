import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
    user;
    token;
    userImage;
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

    setUserImage(image) {
        this.userImage = image;
    }

    getUserLogin() {
        return this.user;
    }

    getUserToken() {
        return this.token;
    }

    getUserImage() {
        return this.userImage;
    }

    destroyUserLogin() {
        this.user = null;
    }



}