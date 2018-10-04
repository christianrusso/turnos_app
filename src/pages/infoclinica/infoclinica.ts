import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import * as moment from 'moment';

@Component({
  selector: 'page-infoclinica',
  templateUrl: 'infoclinica.html'
})
export class InfoclinicaPage {

  private id = "";
  private results;
  private moment = moment();
  private day;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants,
  ) {
    this.id = navParams.get("id");
    this.day = this.moment.day();

    let url = this.constants.API_URL + 'Clinic/GetByFilter';
    let options = {
      "clinicId": this.id,
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
