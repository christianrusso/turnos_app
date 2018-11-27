import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { CuentaPage } from '../cuenta/cuenta';
import { PersonalesPage } from '../personales/personales';
import { NotificacionesPage } from '../notificaciones/notificaciones';

@Component({
  selector: 'page-mis-notificaciones',
  templateUrl: 'misnotificaciones.html'
})
export class MisNotificacionesPage {

  alertTurn = [];

  constructor(
      public navCtrl: NavController,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService
  ) {
  }

  ionViewWillEnter() {
    if (this.userService.getUserLogin() == null || this.userService.getUserLogin() == '') {
      this.navCtrl.parent.select(4);
    } else {
      this.search();
    }
  }

  search() {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.userService.getUserToken())
    let url = this.constants.API_URL + 'Client/GetWeekForClient';
    let options = {
      "startDate": new Date(),
      "endDate": new Date()
    };
    this.http.post(url, options, {headers}).subscribe(
        (success: any) => {
          this.alertTurn = [];
          var clinics = success.clinic_GetWeekForClient;
          var hairdress = success.hairdressing_GetWeekForClient;
          clinics.forEach(element => {
            if (element.appointments.length > 0) {
              element.appointments.forEach(appoint => {
                if (appoint.state == 1) {
                  var now = new Date().getTime();
                  var to = new Date(appoint.dateTime).getTime();
                  appoint.diffToAppointment = Math.round((to-now) / 60000);
                }
                this.alertTurn.push(appoint);
              })
            }
          })
          hairdress.forEach(element => {
            if (element.appointments.length > 0) {
              element.appointments.forEach(appoint => {
                if (appoint.state == 1) {
                  var now = new Date().getTime();
                  var to = new Date(appoint.dateTime).getTime();
                  appoint.diffToAppointment = Math.round((to-now) / 60000);
                }
                this.alertTurn.push(appoint);
              })
            }
          })
          console.log(this.alertTurn);
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
