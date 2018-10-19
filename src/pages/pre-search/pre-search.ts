import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { SearchPage } from '../search/search';
import * as moment from 'moment';

@Component({
  selector: 'page-presearch',
  templateUrl: 'pre-search.html'
})
export class PreSearchPage {

  private category = "";
  private categories;
  private place = "";
  private days = [];
  private when = "";

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

    moment.locale('es');
    for (var i = 0; i < 30; i++) {
      this.days.push(
          {
            name: moment().add(i, 'days').format('LL'),
            value: moment().add(i, 'days').format('YYYY-MM-DD')
          }
      )
    }
  }

  search() {
    let start = this.when;
    let end   = this.when;

    if (this.when != "") {
      if (this.when == "7") {
        start = moment().format('YYYY-MM-DD');
        end = moment().add(7, 'days').format('YYYY-MM-DD');
      }
      if (this.when == "14") {
        start = moment().format('YYYY-MM-DD');
        end = moment().add(14, 'days').format('YYYY-MM-DD');
      }
    }

    this.navCtrl.push(SearchPage, {
      category: this.category,
      place:    this.place,
      AvailableAppointmentStartDate: start,
      AvailableAppointmentEndDate: end
    });
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

}
