import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-presearch',
  templateUrl: 'pre-search.html'
})
export class PreSearchPage {

  private category = "";

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams
  ) {
    this.category = navParams.get("category");
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

}
