import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-presearch',
  templateUrl: 'pre-search.html'
})
export class PreSearchPage {

  private category = "";
  private categories;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants
  ) {
    this.category = navParams.get("category");

    let url = this.constants.API_URL + 'Data/GetCitiesForSelect';
    let msj = '';
    this.http.post(url, "").subscribe(
        (success: any) => {
          console.log(success);
          this.categories = success;
        },
        error => {
          console.log(error);
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: error.error,
            buttons: ['OK']
          });
          alert.present();
        }
    );
  }

  search() {
    this.navCtrl.push(SearchPage, {
      category: this.category
    });
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

}
