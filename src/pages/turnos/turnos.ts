import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { CancelTurnoPage } from '../cancel-turno/cancel-turno';
import { CompleteTurnoPage } from '../complete-turno/complete-turno';
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
    from: new Date(),
    to: 0,
    daysConfig: []
  };
  public hasAppeared = false;
  public isSearching = false;
  public showBack = false;
  public startDate;
  public endDate;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants,
      private userService: UserService,
      private modalCtrl: ModalController
  ) {
    var dateOffset = (24*60*60*1000) * 120;
    var myDate = new Date();
    myDate.setTime(myDate.getTime() - dateOffset);
    this.options.from = myDate;
  }

  ionViewDidEnter() {
    this.moment = moment();
    this.startDate = this.moment.subtract(30, 'days').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) + ".000Z";
    this.endDate = this.moment.add(120, 'days').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) + ".000Z";
    this.getReservas();
  }

  getReservas() {
    this.userService.getUserLogin().then((value) => {
      if (value == null) {
        this.navCtrl.parent.select(4);
      } else {
        this.isSearching = true;

        let _daysConfig: DayConfig[] = [];
        this.options.daysConfig = _daysConfig;

        let url = this.constants.API_URL + "client/GetWeekForClient";
        let headers = new HttpHeaders();
        this.userService.getUserToken().then((tok) => {
          headers = headers.set('Authorization', 'Bearer ' + tok);
          if (this.hasAppeared) {
            this.moment.subtract(30, 'days');
          }
          let options = {
            "startDate": this.startDate,
            "endDate": this.endDate
          };

          this.http.post(url, options, {headers}).subscribe(
              (success: any) => {
                var clinics = success.clinic_GetWeekForClient;
                var hairdress = success.hairdressing_GetWeekForClient;
                clinics.forEach(element => {
                  if (element.appointments.length > 0) {
                    element.appointments.forEach(appoint => {
                      if (appoint.state == 1 || appoint.state == 2 || appoint.state == 3) {
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
                      }
                    })
                  }
                });
                hairdress.forEach(element => {
                  if (element.appointments.length > 0) {
                    element.appointments.forEach(appoint => {
                      if (appoint.state == 1 || appoint.state == 2 || appoint.state == 3) {
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
                      }
                    })
                  }
                });
                this.options.daysConfig = _daysConfig;
                this.hasAppeared = true;
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

  showDayEvents(event) {
    var date = new Date(event._d);
    this.searchSpecificDay(date.getFullYear(), date.getMonth(), date.getDate());
  }

  searchSpecificDay(year, month, day) {
    this.userService.getUserToken().then((tok) => {
      this.appointments = [];
      let url = this.constants.API_URL + "client/GetWeekForClient";

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + tok);
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
                  if (appoint.state == 1 || appoint.state == 2 || appoint.state == 3) {
                    var date = new Date(appoint.dateTime);
                    var minutes = date.getMinutes().toString();
                    if (minutes == "0") {
                      minutes = "00";
                    }
                    if (date <= new Date()) {
                      var datePosition = true;
                    } else {
                      var datePosition = false;
                    }
                    data.push({
                      date: date.getHours() + ":" + minutes,
                      doctor: appoint.doctor,
                      clinica: appoint.clinic,
                      id: appoint.id,
                      state: appoint.state,
                      datePosition: datePosition,
                      subspecialty: appoint.subspecialty,
                      rubro: 1
                    });
                  }
                })
              }
            });
            hairdress.forEach(element => {
              if (element.appointments.length > 0) {
                element.appointments.forEach(appoint => {
                  if (appoint.state == 1 || appoint.state == 2 || appoint.state == 3) {
                    var date = new Date(appoint.dateTime);
                    var minutes = date.getMinutes().toString();
                    if (minutes == "0") {
                      minutes = "00";
                    }
                    if (date <= new Date()) {
                      var datePosition = true;
                    } else {
                      var datePosition = false;
                    }
                    data.push({
                      date: date.getHours() + ":" + minutes,
                      doctor: appoint.professional,
                      clinica: appoint.hairdressing,
                      id: appoint.id,
                      state: appoint.state,
                      datePosition: datePosition,
                      subspecialty: appoint.subspecialty,
                      rubro: 2
                    });
                  }
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
      this.appointments = data;
    });
  }

  cancelTurno(id, rubro) {
    this.showBack = true;

    let orderModal = this.modalCtrl.create(CancelTurnoPage);
    orderModal.onDidDismiss(data => {
      this.showBack = false;
      if (data.motivo && data.motivo != "") {
        this.cancel(id, data.motivo, rubro);
      }
    });
    orderModal.present();
  }

  cancel(id, comment, rubro) {
    let headers = new HttpHeaders();
    this.userService.getUserToken().then((tok) => {
      headers = headers.set('Authorization', 'Bearer ' + tok);
      let options = {
        Id: id,
        Score: 0,
        Comment: comment
      };
      let url;
      switch (rubro) {
        case 1:
          url = this.constants.API_URL + 'Appointment/CancelAppointment';
          break;
        case 2:
          url = this.constants.API_URL + 'Hairdressing/HairdressingAppointment/CancelAppointment';
          break;
      }
      this.http.post(url, options, {headers}).subscribe(
          (success: any) => {
            this.appointments = [];
            this.getReservas();
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

  completeTurno(id, rubro) {
    this.showBack = true;

    let orderModal = this.modalCtrl.create(CompleteTurnoPage);
    orderModal.onDidDismiss(data => {
      this.showBack = false;
      if (data.comment && data.comment != "" && data.score && data.score != '0') {
        this.complete(id, data.comment, data.score, rubro);
      }
    });
    orderModal.present();
  }

  complete(id, comment, score, rubro) {
    let headers = new HttpHeaders();
    this.userService.getUserToken().then((tok) => {
      headers = headers.set('Authorization', 'Bearer ' + tok);
      let options = {
        Id: id,
        Score: score,
        Comment: comment
      };
      let url;
      switch (rubro) {
        case 1:
          url = this.constants.API_URL + 'Appointment/CompleteAppointment';
          break;
        case 2:
          url = this.constants.API_URL + 'Hairdressing/HairdressingAppointment/CompleteAppointment';
          break;
      }
      this.http.post(url, options, {headers}).subscribe(
          (success: any) => {
            this.appointments = [];
            this.getReservas();
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

}
