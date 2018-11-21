import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';
import { CalendarModalOptions, DayConfig, CalendarModal } from "ion2-calendar";
import { HourPage } from '../hour/hour';

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
  subspeciality;
  step = 1;
  moment = moment();
  doctor;
  turnos = [];
  public options: CalendarModalOptions = {
    daysConfig: []
  };
  hour;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private constants: Constants,
      private userService: UserService,
      public modalCtrl: ModalController
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
    this.subspeciality = id;
    let headers = new HttpHeaders();
    if (this.userService.getUserLogin() != null && this.userService.getUserLogin() != '') {
      headers = headers.set('Authorization', 'Bearer ' + this.userService.getUserToken())
    }
    let url = this.constants.API_URL + 'Doctor/GetByFilter';
    let options = {
      "clinicId":       this.clinicId,
      "specialtyId":    this.specialities[this.speciality].id,
      "subspecialtyId": this.specialities[this.speciality].subspecialties[this.subspeciality].id
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

  getTurnos() {
    let headers = new HttpHeaders();
    if (this.userService.getUserLogin() != null && this.userService.getUserLogin() != '') {
      headers = headers.set('Authorization', 'Bearer ' + this.userService.getUserToken())
    }
    let url = this.constants.API_URL + 'Appointment/GetAvailableAppointmentsPerDay';
    let options = {
      "startDate":      this.moment.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) + ".000Z",
      "endDate":        this.moment.add(30, 'days').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) + ".000Z",
      "clinicId":       this.clinicId,
      "specialtyId":    this.specialities[this.speciality].id,
      "subspecialtyId": this.specialities[this.speciality].subspecialties[this.subspeciality].id,
      "doctorId":       null
    };
    if (this.doctor != null) {
      options.doctorId = this.doctors[this.doctor].id;
    }
    this.http.post(url, options, {headers}).subscribe(
        (success: any) => {
          this.turnos = success;
          let _daysConfig: DayConfig[] = [];
          this.turnos.forEach(appoint => {
            var quantity = appoint.availableAppointments;
            if (quantity == 1) {
              quantity += " turno";
            } else {
              quantity += " turnos";
            }
            _daysConfig.push({
              date: new Date(appoint.day),
              marked: true,
              subTitle: quantity,
              cssClass: 'Event'
            })
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

  showDayHours(event) {
    var date = new Date(event._d);
    var day = this.moment.format(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T00:00:00.000Z");

    (document.querySelector('#backBlackReserva') as HTMLElement).style.visibility = 'visible';
    (document.querySelector('#backBlackReserva') as HTMLElement).style.opacity    = '0.7';

    var data = {doctors: this.doctors, date: day, doctor: null, clinic: this.clinicId};
    if (this.doctor != null) {
      data.doctor = this.doctors[this.doctor].id;
    }
    let orderModal = this.modalCtrl.create(HourPage, data);
    orderModal.onDidDismiss(data => {
      this.hour   = data.hour;
      this.doctor = data.doctor;
      (document.querySelector('#backBlackReserva') as HTMLElement).style.visibility = 'hidden';
      (document.querySelector('#backBlackReserva') as HTMLElement).style.opacity    = '0';
      this.nextStep();
    });
    orderModal.present();
  }

  nextStep() {
    if (this.step == 1) {
      if (this.speciality != null && this.subspeciality != null) {
        this.getTurnos();
        this.step = 2;
        (document.querySelector('#firstStep') as HTMLElement).style.color = "#454EDB";
        (document.querySelector('#firstStep') as HTMLElement).style.backgroundColor = "transparent";

        (document.querySelector('#secondStep') as HTMLElement).style.color = "white";
        (document.querySelector('#secondStep') as HTMLElement).style.backgroundColor = "#454EDB";

        (document.querySelector('.firstArrow') as HTMLElement).style.display = "none";
        (document.querySelector('.secondArrow') as HTMLElement).style.display = "block";
      }
    }
    if (this.step == 2 && this.hour != null && this.doctor != null) {
      this.step = 3;
      (document.querySelector('#secondStep') as HTMLElement).classList.remove('positionFirstNumber');
      (document.querySelector('#secondStep') as HTMLElement).classList.add('positionSecondNumber');

      (document.querySelector('#thirdStep') as HTMLElement).classList.remove('positionSecondNumber');
      (document.querySelector('#thirdStep') as HTMLElement).classList.add('positionFirstNumber');
    }
  }

}
