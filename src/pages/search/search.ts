import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { InfoclinicaPage } from '../infoclinica/infoclinica';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  private category = "";
  public  results;
  private place = "";
  private AvailableAppointmentStartDate = "";
  private AvailableAppointmentEndDate = "";

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants
  ) {
    this.category = navParams.get("category")[0].toUpperCase() + navParams.get("category").slice(1).toLowerCase();
    this.place    = navParams.get("place");
    this.AvailableAppointmentStartDate = navParams.get("AvailableAppointmentStartDate");
    this.AvailableAppointmentEndDate = navParams.get("AvailableAppointmentEndDate");

    let url = this.constants.API_URL + 'Clinic/GetByFilter';
    let cities = [];
    if (this.place != "" && this.place != null) {
      cities.push(this.place.toString());
    }
    let options = {
      "Cities": cities,
      "Specialties": [],
      "Subspecialties": [],
      "MedicalInsurances": [],
      "medicalPlans": [],
      "Score": "",
      "ScoreQuantity": "",
      "AvailableAppointmentStartDate": this.AvailableAppointmentStartDate,
      "AvailableAppointmentEndDate": this.AvailableAppointmentEndDate
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

  goToClinicInfo(id) {
    this.navCtrl.push(InfoclinicaPage, {
      id: id
    });
  }

}
