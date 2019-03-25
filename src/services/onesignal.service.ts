import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';

@Injectable()
export class OneSignalService {

    constructor(private oneSignal: OneSignal) {
    }

    suscribe(userId)
    {
        console.log(userId);
        this.oneSignal.startInit('88269b56-66d3-4f0d-b8c0-6e4bd464a92e', '165662386132');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.handleNotificationReceived().subscribe(() => {
            // do something when notification is received
        });
        this.oneSignal.handleNotificationOpened().subscribe(() => {
            // do something when a notification is opened
        });
        this.oneSignal.endInit();
        this.oneSignal.sendTag('userid', userId);
    }
}