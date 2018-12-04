import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import * as moment from 'moment';

@Component({
  selector: 'page-notpacient',
  templateUrl: 'notpacient.html'
})
export class NotpacientPage {

  clinicId;
  insurance;
  plan = null;
  insurances;
  plans;

  constructor(
      public navCtrl: NavController,
      private viewCtrl: ViewController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private userService: UserService,
      private http: HttpClient,
      private constants: Constants
  ) {
    this.clinicId = navParams.get("clinic");
  }

  ionViewWillEnter() {
    this.getInsurances();
  }

  getInsurances() {
    let headers = new HttpHeaders();
    if (this.userService.getUserLogin() != null && this.userService.getUserLogin() != '') {
      headers = headers.set('Authorization', 'Bearer ' + this.userService.getUserToken())
    }

    let url = this.constants.API_URL + 'MedicalInsurance/GetAllByClinic';
    let options = {
      "id": this.clinicId
    };
    return this.http.post(url, options, {headers}).subscribe(
        (success: any) => {
          this.insurances = success;
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

  getPlans(insurance) {
    this.plan = null;
    if (insurance != "" && insurance != null) {
      let headers = new HttpHeaders();
      if (this.userService.getUserLogin() != null && this.userService.getUserLogin() != '') {
        headers = headers.set('Authorization', 'Bearer ' + this.userService.getUserToken())
      }

      let url = this.constants.API_URL + 'MedicalPlan/GetAll';
      let options = {
        "Id": insurance,
        "UserId": this.clinicId
      };
      return this.http.post(url, options, {headers}).subscribe(
          (success: any) => {
            this.plans = success;
            console.log(success);
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

  returnData() {
    if (this.plan != null && this.plan != "") {
      let data = {plan: this.plan};
      this.viewCtrl.dismiss(data);
    }
  }

}
