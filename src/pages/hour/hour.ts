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
  entity;
  day;
  moment = moment();
  isFirst = true;
  category;
  subspecialty;

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
    this.entity = navParams.get("entity");
    this.doctor = navParams.get("doctor");
    this.day = navParams.get("date");
    this.category = navParams.get("category");
    this.subspecialty = navParams.get("subspecialty");
    if (this.doctor != null) {
      this.searchHours(this.doctor);
    }
  }

  searchHours(doctorId) {
    let headers = new HttpHeaders();
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.userService.getUserToken().then((tok) => {
          this.isFirst = false;
          headers = headers.set('Authorization', 'Bearer ' + tok);
          let options = {
            "day":      this.day,
            "doctorId": null,
            "professionalId": null,
            "subspecialtyId": this.subspecialty
          };
          let url = "";
          switch (this.category) {
            case "Medicina":
              url = this.constants.API_URL + 'Appointment/GetAllAvailablesForDay';

              options["clinicId"] = this.entity;

              if (this.doctor != null) {
                options.doctorId = parseInt(this.doctor);
              }

              break;
            case "Peluquerias":
            case "Barberias":
            case "Esteticas":
              url = this.constants.API_URL + 'Hairdressing/HairdressingAppointment/GetAllAvailablesForDay';

              options["hairdressingId"] = this.entity;

              if (this.doctor != null) {
                options.professionalId = parseInt(this.doctor);
              }

              break;
          }
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
        });
      }
    });
  }

  returnData() {
    let data = {doctor: this.doctor, hour: this.hour};
    this.viewCtrl.dismiss(data);
  }

  cancelData() {
    this.viewCtrl.dismiss({});
  }

}
