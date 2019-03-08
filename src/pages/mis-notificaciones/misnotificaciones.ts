import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-mis-notificaciones',
  templateUrl: 'misnotificaciones.html',
})
export class MisNotificacionesPage {

  alertTurn = [];
  isSearching = false;

  constructor(
      public navCtrl: NavController,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService
  ) {
  }

  ionViewDidEnter() {
    let headers = new HttpHeaders();
    this.userService.getUserLogin().then((value) => {
      if (value == null) {
        this.navCtrl.parent.select(4);
      } else {
        this.search();
      }
    });
  }

  search() {
    let headers = new HttpHeaders();
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.userService.getUserToken().then((tok) => {
          this.isSearching = true;
          this.alertTurn = [];
          headers = headers.set('Authorization', 'Bearer ' + tok);
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
                        appoint.diffToAppointment = Math.round((to - now) / 60000);
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
                        appoint.diffToAppointment = Math.round((to - now) / 60000);
                      }
                      this.alertTurn.push(appoint);
                    })
                  }
                })
                this.isSearching = false;
              },
              error => {
                console.log(error);
                let alert = this.alertCtrl.create({
                  title: 'Error!',
                  subTitle: error.error,
                  buttons: ['OK']
                });
                alert.present();
                this.isSearching = false;
              }
          );
        });
      }
    });
  }

}
