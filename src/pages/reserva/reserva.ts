import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-reserva',
  templateUrl: 'reserva.html'
})
export class ReservaPage {

  clinicId;
  specialities;
  subspecialities;
  doctors;
  speciality;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService
  ) {
  }

  getSpecialities() {
    let headers = new HttpHeaders();
    if (this.userService.getUserLogin() != null && this.userService.getUserLogin() != '') {
      headers = headers.set('Authorization', 'Bearer ' + this.userService.getUserToken())
    }
    let url = this.constants.API_URL + 'Specialty/GetAllByClinic';
    let options = {
      "id": this.clinicId
    };
    this.http.post(url, options, {headers}).subscribe(
        (success: any) => {
          this.specialities = success;
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

  ionViewWillEnter() {
    if (this.userService.getUserLogin() == null || this.userService.getUserLogin() == '') {
      this.navCtrl.parent.select(4);
    } else {
      this.clinicId = this.navParams.get("clinicId");
      this.getSpecialities();
    }
  }

  getSubspecialities(index) {
    this.speciality = index;
    this.subspecialities = this.specialities[index].subspecialties;
  }

  getDoctors(id) {
    let headers = new HttpHeaders();
    if (this.userService.getUserLogin() != null && this.userService.getUserLogin() != '') {
      headers = headers.set('Authorization', 'Bearer ' + this.userService.getUserToken())
    }
    let url = this.constants.API_URL + 'Doctor/GetByFilter';
    let options = {
      "clinicId":       this.clinicId,
      "specialtyId":    this.specialities[this.speciality].id,
      "subspecialtyId": this.specialities[this.speciality].subspecialties[id].id
    };
    this.http.post(url, options, {headers}).subscribe(
        (success: any) => {
          this.doctors = success;
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
