import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserService {
    user;
    token;
    userImage;
    myIndex = 0;
    constructor(
        private storage: Storage
    ) {
    }

    setUserLogin(user) {
        this.storage.set('user', user);
    }

    setUserToken(token) {
        this.storage.set('token', token);
    }

    setUserId(userId) {
        this.storage.set('userId', userId);
    }

    setUserImage(image) {
        this.storage.set('userImage', image);
    }

    getUserLogin() {
        return this.storage.get('user').then((val) => {
            return val;
        });
    }

    getUserToken() {
        return this.storage.get('token').then((val) => {
            return val;
        });
    }

    getUserId() {
        return this.storage.get('userId').then((val) => {
            return val;
        });
    }

    getUserImage() {
        return this.storage.get('userImage').then((val) => {
            return val;
        });
    }

    destroyUserLogin() {
        this.storage.clear().then(() => {
        });
    }



}