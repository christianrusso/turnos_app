import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import * as moment from 'moment';

@Component({
  selector: 'page-hour',
  templateUrl: 'hour.html'
})
export class HourPage {

  doctor;
  doctors;
  hour;
  hours;
  clinicId;
  day;
  moment = moment();
  isFirst = true;

  constructor(
      public navCtrl: NavController,
      private viewCtrl: ViewController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private userService: UserService,
      private http: HttpClient,
      private constants: Constants
  ) {
    this.doctors = navParams.get("doctors");
    this.clinicId = navParams.get("clinic");
    this.doctor = navParams.get("doctor");
    this.day = navParams.get("date");
    if (this.doctor != null) {
      this.searchHours(this.doctor);
    }
  }

  searchHours(doctorId) {
    this.isFirst = false;
    let headers = new HttpHeaders();
    if (this.userService.getUserLogin() != null && this.userService.getUserLogin() != '') {
      headers = headers.set('Authorization', 'Bearer ' + this.userService.getUserToken())
    }
    let url = this.constants.API_URL + 'Appointment/GetAllAvailablesForDay';
    let options = {
      "day":      this.day,
      "clinicId": this.clinicId,
      "doctorId": doctorId
    };
    return this.http.post(url, options, {headers}).subscribe(
        (success: any) => {
          this.hours = success;
          for (var i = 0; i < this.hours.length; i++) {
            this.hours[i] = this.moment.format(this.hours[i]).substring(11);
          }
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

  returnData() {
    let data = {doctor: this.doctor, hour: this.hour};
    this.viewCtrl.dismiss(data);
  }

  cancelData() {
    this.viewCtrl.dismiss({});
  }

}
