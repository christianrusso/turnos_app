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
      statusBar.styleDefault();
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString('#454EDA');
      splashScreen.hide();
      keyboard.hideFormAccessoryBar(false);
    });
  }
}
