import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { InfoclinicaPage } from '../infoclinica/infoclinica';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { CalendarModalOptions, DayConfig, CalendarModal } from "ion2-calendar";

@Component({
  selector: 'page-turnos',
  templateUrl: 'turnos.html'
})
export class TurnosPage {

  public  results;
  public  alertTurn = [];
  private moment = moment();
  public options: CalendarModalOptions = {
    daysConfig: []
  };

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants,
      private userService: UserService,
      private modalCtrl: ModalController
  ) {
  }

  ionViewDidEnter() {
    this.getReservas();
  }

  getReservas() {
    if (this.userService.getUserLogin() == null || this.userService.getUserLogin() == '') {
      this.navCtrl.parent.select(4);
    } else {
      let url = this.constants.API_URL + "client/GetWeekForClient";
      let headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.userService.getUserToken(),
      });
      let options = {
        "startDate": this.moment.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) + ".000Z",
        "endDate": this.moment.add(30, 'days').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) + ".000Z"
      };

      this.http.post(url, options, {headers}).subscribe(
          (success: any) => {
            let _daysConfig: DayConfig[] = [];
            var clinics = success.clinic_GetWeekForClient;
            var hairdress = success.hairdressing_GetWeekForClient;
            clinics.forEach(element => {
              if (element.appointments.length > 0) {
                element.appointments.forEach(appoint => {
                  _daysConfig.push({
                    date: new Date(appoint.dateTime),
                    marked: true,
                    subTitle: element.appointments.length + " turnos",
                    cssClass: 'Event'
                  })
                })
              }
            });
            hairdress.forEach(element => {
              if (element.appointments.length > 0) {
                element.appointments.forEach(appoint => {
                  _daysConfig.push({
                    date: new Date(appoint.dateTime),
                    marked: true,
                    subTitle: element.appointments.length + " turnos",
                    cssClass: 'Event'
                  })
                })
              }
            });
            this.options.daysConfig = _daysConfig;
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

  showDayEvents(event) {
    console.log(event);
  }

  searchSpecificDay(startDate, endDate) {
    let url = this.constants.API_URL + "client/GetWeekForClient";
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userService.getUserToken(),
    });
    let options = {
      "startDate": startDate + ".000Z",
      "endDate": endDate + ".000Z"
    };
    this.http.post(url, options, {headers}).subscribe(
        (success: any) => {
          let data = [];
          var clinics = success.clinic_GetWeekForClient;
          var hairdress = success.hairdressing_GetWeekForClient;
          clinics.forEach(element => {
            if (element.appointments.length > 0) {
              element.appointments.forEach(appoint => {
                data.push({
                  date: new Date(appoint.dateTime),
                  marked: true,
                  subTitle: element.appointments.length + " turnos",
                  cssClass: 'Event'
                })
              })
            }
          });
          hairdress.forEach(element => {
            if (element.appointments.length > 0) {
              element.appointments.forEach(appoint => {
                data.push({
                  date: new Date(appoint.dateTime),
                  marked: true,
                  subTitle: element.appointments.length + " turnos",
                  cssClass: 'Event'
                })
              })
            }
          });
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
