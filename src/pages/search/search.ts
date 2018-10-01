import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  private category = "";
  public  results;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants
  ) {
    this.category = navParams.get("category");

    let url = this.constants.API_URL + 'Clinic/GetByFilter';
    let options = {
      "Cities": [],
      "Specialties": [],
      "Subspecialties": [],
      "MedicalInsurances": [],
      "medicalPlans": [],
      "Score": "",
      "ScoreQuantity": ""
    };
    this.http.post(url, options).subscribe(
        (success: any) => {
          console.log(success);
          this.results = success;
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

}
