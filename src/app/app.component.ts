import { Component, ViewChild } from '@angular/core';
import { Platform, Keyboard, AlertController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { Deeplinks } from '@ionic-native/deeplinks';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  @ViewChild(Nav) nav: Nav;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    keyboard: Keyboard,
    private alertCtrl: AlertController,
    private deeplinks: Deeplinks,
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString('#454EDA');
      splashScreen.hide();
      keyboard.hideFormAccessoryBar(false);
      //
      if (platform.is('cordova')) {
        console.log('this.nav', this.nav)
        this.deeplinks.routeWithNavController(this.nav, {
          '/tabs': 'tabs',
          '/home': 'home',
          '/presearch/:category': 'presearch',
          '/presearch/:category/search': 'search',
          '/presearch/:category/search/:id': 'info'
        }).subscribe((match) => {
          // match.$route - the route we matched, which is the matched entry from the arguments to route()
          // match.$args - the args passed in the link
          // match.$link - the full link data
          console.log('Successfully matched route', match);
        },
          (nomatch) => {
            // nomatch.$link - the full link data
            console.error('Got a deeplink that didn\'t match', nomatch);
          });
      }
    });
  }
}
