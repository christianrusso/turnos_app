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
  public appointments = [];
  public options: CalendarModalOptions = {
    daysConfig: []
  };
  public hasAppeared = false;

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
      if (this.hasAppeared) {
        this.moment.subtract(30, 'days');
      }
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
                  var quantity = element.appointments.length;
                  if (quantity == 1) {
                    quantity += " turno";
                  } else {
                    quantity += " turnos";
                  }
                  _daysConfig.push({
                    date: new Date(appoint.dateTime),
                    marked: true,
                    subTitle: quantity,
                    cssClass: 'Event'
                  })
                })
              }
            });
            hairdress.forEach(element => {
              if (element.appointments.length > 0) {
                element.appointments.forEach(appoint => {
                  var quantity = element.appointments.length;
                  if (quantity == 1) {
                    quantity += " turno";
                  } else {
                    quantity += " turnos";
                  }
                  _daysConfig.push({
                    date: new Date(appoint.dateTime),
                    marked: true,
                    subTitle: quantity,
                    cssClass: 'Event'
                  })
                })
              }
            });
            this.options.daysConfig = _daysConfig;
            this.hasAppeared = true;
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
    var date = new Date(event._d);
    this.appointments = this.searchSpecificDay(date.getFullYear(), date.getMonth(), date.getDate());
  }

  searchSpecificDay(year, month, day) {
    this.appointments = [];
    let url = this.constants.API_URL + "client/GetWeekForClient";
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userService.getUserToken(),
    });
    let options = {
      "startDate": year + "-" + (month + 1) + "-" + day + "T00:00:00" + ".000Z",
      "endDate": year + "-" + (month + 1) + "-" + day + "T23:59:00" + ".000Z",
    };
    let data = [];
    this.http.post(url, options, {headers}).subscribe(
        (success: any) => {
          var clinics = success.clinic_GetWeekForClient;
          var hairdress = success.hairdressing_GetWeekForClient;
          clinics.forEach(element => {
            if (element.appointments.length > 0) {
              element.appointments.forEach(appoint => {
                var date = new Date(appoint.dateTime);
                var minutes = date.getMinutes().toString();
                if (minutes == "0") {
                  minutes = "00";
                }
                data.push({
                  date: date.getHours() + ":" + minutes,
                  doctor: appoint.doctor,
                  clinica: appoint.clinic
                });
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
    return data;
  }

}
