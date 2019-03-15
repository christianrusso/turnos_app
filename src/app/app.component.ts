import { Component } from '@angular/core';
import { Platform, Keyboard, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from "@ionic-native/deeplinks/ngx";

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, keyboard: Keyboard, private deeplinks: Deeplinks, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      /*this.deeplinks.route({
        '/': this
      }).subscribe(match => {
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: JSON.stringify(match),
          buttons: ['OK']
        });
        alert.present();
      }, noMatch => {
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: JSON.stringify(noMatch),
          buttons: ['OK']
        });
        alert.present();
      });*/

      keyboard.hideFormAccessoryBar(false);
    });
  }
}
