import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';
import { CalendarModalOptions, DayConfig, CalendarModal } from "ion2-calendar";
import { HourPage } from '../hour/hour';
import { NotpacientPage } from '../not-pacient/notpacient';
import { ReservaGeneradaPage } from '../reserva-generada/reserva-generada';

@Component({
  selector: 'page-reserva',
  templateUrl: 'reserva.html'
})
export class ReservaPage {

  id;
  category;
  name;
  address;
  city;
  specialities;
  subspecialities;
  doctors;
  speciality;
  subspeciality;
  step = 1;
  moment = moment();
  doctor;
  doctorName;
  turnos = [];
  public options: CalendarModalOptions = {
    daysConfig: []
  };
  hour;
  day;
  dayUnmodified;
  medicalPlan;
  showBack = false;
  professional = "";

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
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.userService.getUserToken().then((tok) => {
          headers = headers.set('Authorization', 'Bearer ' + tok);
          let url = "";
          switch (this.category) {
            case "Medicina":
              url = this.constants.API_URL + 'Specialty/GetAllByClinic';
              break;
            case "Peluquerias":
            case "Barberias":
            case "Esteticas":
              url = this.constants.API_URL + 'Hairdressing/HairdressingSpecialty/GetAllByHairdressing';
              break;
          }
          let options = {
            "id": this.id
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
        });
      }
    });
  }

  ionViewDidEnter() {
    this.userService.getUserLogin().then((value) => {
      if (value == null) {
        this.navCtrl.parent.select(4);
      } else {
        this.id = this.navParams.get("id");
        this.category = this.navParams.get("category");
        this.name = this.navParams.get("name");
        this.address = this.navParams.get("address");
        this.city = this.navParams.get("city");
        this.getSpecialities();

        switch (this.category) {
          case "Medicina":
            this.professional = "MÉDICO";
            break;
          default:
            this.professional = "PROFESIONAL";
            break;
        }
      }
    });
  }

  getSubspecialities(index) {
    this.speciality = index;
    this.subspecialities = this.specialities[index].subspecialties;
  }

  getDoctors(id) {
    this.subspeciality = id;
    let headers = new HttpHeaders();
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.userService.getUserToken().then((tok) => {
          headers = headers.set('Authorization', 'Bearer ' + tok);
          let url;
          let options = {
            "specialtyId":    this.specialities[this.speciality].id,
            "subspecialtyId": this.specialities[this.speciality].subspecialties[this.subspeciality].id
          };
          switch (this.category) {
            case "Medicina":
              url = this.constants.API_URL + 'Doctor/GetByFilter';
              options["clinicId"] = this.id;
              break;
            case "Peluquerias":
            case "Barberias":
            case "Esteticas":
              url = this.constants.API_URL + 'Hairdressing/HairdressingProfessional/GetByFilter';
              options["hairdressingId"] = this.id;
              break;
          }
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
        });
      }
    });
  }

  getTurnos() {
    let headers = new HttpHeaders();
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.userService.getUserToken().then((tok) => {
          headers = headers.set('Authorization', 'Bearer ' + tok);
          let options = {
            "startDate":      this.moment.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) + ".000Z",
            "endDate":        this.moment.add(30, 'days').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) + ".000Z",
            "specialtyId":    this.specialities[this.speciality].id,
            "subSpecialtyId": this.specialities[this.speciality].subspecialties[this.subspeciality].id,
            "doctorId":       null,
            "professionalId": null
          };
          let url = "";
          switch (this.category) {
            case "Medicina":
              url = this.constants.API_URL + 'Appointment/GetAvailableAppointmentsPerDay';
              options["clinicId"] = this.id;
              if (this.doctor != null) {
                options.doctorId = this.doctors[this.doctor].id;
              }
              break;
            case "Peluquerias":
            case "Barberias":
            case "Esteticas":
              url = this.constants.API_URL + 'Hairdressing/HairdressingAppointment/GetAvailableAppointmentsPerDay';
              options["hairdressingId"] = this.id;
              if (this.doctor != null) {
                options.professionalId = this.doctors[this.doctor].id;
              }
              break;
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
                    date: new Date(appoint.day.substr(0, 4) + "-" + appoint.day.substr(5, 2) + "-" + appoint.day.substr(8, 2) + " " + appoint.day.substr(11, 8)),
                    marked: true,
                    subTitle: quantity,
                    cssClass: 'Event'
                  })
                });
                console.log(_daysConfig);
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
        });
      }
    });
  }

  showDayHours(event) {
    var date = new Date(event._d);
    var dayFirst = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    var day = this.moment.format(dayFirst + "T00:00:00.000Z");

    this.showBack = true;

    var data = {doctors: this.doctors, date: day, doctor: null, entity: this.id, category: this.category,
    subspecialty: this.specialities[this.speciality].subspecialties[this.subspeciality].id};
    if (this.doctor != null) {
      data.doctor = this.doctors[this.doctor].id;
    }

    this.day = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    this.dayUnmodified = dayFirst;

    let orderModal = this.modalCtrl.create(HourPage, data);
    orderModal.onDidDismiss(data => {
      this.showBack = false;
      if (data.hour && data.doctor) {
        this.hour = data.hour;
        this.doctor = data.doctor;
        for (var i = 0; i < this.doctors.length; i++) {
          if (this.doctors[i].id == this.doctor) {
            this.doctorName = this.doctors[i].firstName + " " + this.doctors[i].lastName;
          }
        }
        this.nextStep();
      }
    });
    orderModal.present();
  }

  nextStep() {
    if (this.step == 1) {
      if (this.speciality != null && this.subspeciality != null) {
        this.getTurnos();
        this.step = 2;
        (document.querySelector('#secondStep') as HTMLElement).style.color = "white";
        (document.querySelector('#secondStep') as HTMLElement).style.backgroundColor = "#454EDB";

        (document.querySelector('.firstArrow') as HTMLElement).style.display = "none";
        (document.querySelector('.secondArrow') as HTMLElement).style.display = "block";
      }
    } else if (this.step == 2) {
      if (this.step == 2 && this.hour != null && this.doctor != null) {
        this.step = 3;
        (document.querySelector('#thirdStep') as HTMLElement).style.color = "white";
        (document.querySelector('#thirdStep') as HTMLElement).style.backgroundColor = "#454EDB";

        (document.querySelector('.secondArrow') as HTMLElement).style.display = "none";
        (document.querySelector('.thirdArrow') as HTMLElement).style.display = "block";
      }
    } else if (this.step == 3) {
      //Check if user is patient of clinic
      let headers = new HttpHeaders();
      this.userService.getUserLogin().then((value) => {
        if (value != null) {
          this.userService.getUserToken().then((tok) => {
            headers = headers.set('Authorization', 'Bearer ' + tok);

            let options = {
              "id": this.id
            };
            let url = "";
            switch (this.category) {
              case "Medicina":
                url = this.constants.API_URL + 'Clinic/IsPatientOfClinic';
                break;
              case "Peluquerias":
              case "Barberias":
              case "Esteticas":
                url = this.constants.API_URL + 'Hairdressing/Hairdressing/IsPatientOfHairdressing';
                break;
            }
            this.http.post(url, options, {headers}).subscribe(
                (success: any) => {
                  var urlRequest = this.constants.API_URL;
                  var optionsRequest;
                  if (success == true) {
                    //IS PATIENT

                    optionsRequest = {
                      "day": this.dayUnmodified + "T" + this.hour + ".000Z",
                      "time": this.dayUnmodified + "T" + this.hour + ".000Z",
                      "Source": this.constants.source,
                      "subspecialtyId": this.specialities[this.speciality].subspecialties[this.subspeciality].id
                    };
                    switch (this.category) {
                      case "Medicina":
                        urlRequest += "Appointment/RequestAppointmentByPatient";
                        optionsRequest["clinicId"] = this.id;
                        optionsRequest["doctorId"] = this.doctor;
                        break;
                      case "Peluquerias":
                      case "Barberias":
                      case "Esteticas":
                        urlRequest += "Hairdressing/HairdressingAppointment/RequestAppointmentByPatient";
                        optionsRequest["hairdressingId"] = this.id;
                        optionsRequest["professionalId"] = this.doctor;
                        break;
                    }

                    //MAKE APPOINTMENT
                    this.http.post(urlRequest, optionsRequest, {headers}).subscribe(
                        (success: any) => {
                          this.navCtrl.push(ReservaGeneradaPage);
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
                  } else if (success == false) {
                    //IS NOT PATIENT
                    (document.querySelector('#backBlackReserva') as HTMLElement).style.visibility = 'visible';
                    (document.querySelector('#backBlackReserva') as HTMLElement).style.opacity    = '0.7';

                    urlRequest += "";
                    optionsRequest = {
                      "day": this.dayUnmodified + "T" + this.hour + ".000Z",
                      "time": this.dayUnmodified + "T" + this.hour + ".000Z",
                      "Source": this.constants.source,
                      "subspecialtyId": this.specialities[this.speciality].subspecialties[this.subspeciality].id
                    };
                    if (this.category == "Medicina") {
                      let orderModal = this.modalCtrl.create(NotpacientPage, {clinic: this.id});
                      orderModal.onDidDismiss(data => {
                        this.medicalPlan = data.plan;
                        urlRequest += "Appointment/RequestAppointmentByClient";
                        optionsRequest["clinicId"] = this.id;
                        optionsRequest["doctorId"] = this.doctor;
                        optionsRequest["medicalPlanId"] = this.medicalPlan;

                        (document.querySelector('#backBlackReserva') as HTMLElement).style.visibility = 'hidden';
                        (document.querySelector('#backBlackReserva') as HTMLElement).style.opacity = '0';

                        this.makeAppointment(urlRequest, optionsRequest, headers);
                      });
                      orderModal.present();
                    } else {
                      urlRequest += "Hairdressing/HairdressingAppointment/RequestAppointmentByClient";
                      optionsRequest["hairdressingId"] = this.id;
                      optionsRequest["professionalId"] = this.doctor;

                      this.makeAppointment(urlRequest, optionsRequest, headers);
                    }
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
  }

  makeAppointment(urlRequest, optionsRequest, headers) {
    this.http.post(urlRequest, optionsRequest, {headers}).subscribe(
        (success: any) => {
          this.navCtrl.push(ReservaGeneradaPage);
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
