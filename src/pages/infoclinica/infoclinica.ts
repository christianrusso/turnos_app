import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import * as moment from 'moment';
import { UserService } from '../../services/user.service';
import { ReservaPage } from '../reserva/reserva';
import { SharePage } from "../share/share";
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

@Component({
  selector: 'page-infoclinica',
  templateUrl: 'infoclinica.html',
  providers :[LaunchNavigator]
})
export class InfoclinicaPage {

  private id = "";
  private category;
  private results;
  private moment = moment();
  private day;
  private isOpenDays = false;
  private isOpenServices = false;
  map:any;
  destinationPoint : any;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants,
      private userService: UserService,
      public modalCtrl: ModalController,
      private launchNavigator: LaunchNavigator
  ) {
    this.id = navParams.get("id");
    this.category = navParams.get("category");
    this.day = this.moment.day();
  }

  openMap() {
    let options: LaunchNavigatorOptions ={
      app: this.launchNavigator.APP.USER_SELECT
    }
    this.launchNavigator.navigate(this.destinationPoint,options).then(()=>{
      console.log("launched successfully");
    }).catch(()=>{
      console.log("launch failed");
    })
  }

  ionViewWillEnter() {
    this.search();
  }

  search() {
    let headers = new HttpHeaders();
    if (this.userService.getUserLogin() != null && this.userService.getUserLogin() != '') {
      headers = headers.set('Authorization', 'Bearer ' + this.userService.getUserToken())
    }

    let businessType;
    let options = {
      "Cities": [],
      "Specialties": [],
      "Subspecialties": [],
      "MedicalInsurances": [],
      "medicalPlans": [],
      "Score": "",
      "Stars": [],
      "ScoreQuantity": ""
    };
    let url = "";
    switch (this.category) {
      case "Medicina":
        url = this.constants.API_URL + 'Clinic/GetByFilter';
        businessType = 1;
        options["clinicId"] = this.id;
        options["businessType"]= businessType;
        break;
      case "Peluquerias":
        url = this.constants.API_URL + 'Hairdressing/Hairdressing/GetByFilter';
        businessType = 2;
        options["hairdressingId"] = this.id;
        options["businessType"]= businessType;
        break;
      case "Barberias":
        url = this.constants.API_URL + 'Hairdressing/Hairdressing/GetByFilter';
        businessType = 3;
        options["hairdressingId"] = this.id;
        options["businessType"]= businessType;
        break;
      case "Esteticas":
        url = this.constants.API_URL + 'Hairdressing/Hairdressing/GetByFilter';
        businessType = 4;
        options["hairdressingId"] = this.id;
        options["businessType"]= businessType;
        break;
    }

    this.http.post(url, options, {headers}).subscribe(
        (success: any) => {
          this.results = success;
          this.destinationPoint = [this.results[0].latitude, this.results[0].longitude];
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

  showHorarios() {
    let elements;
    if (!this.isOpenDays) {
      elements = document.querySelectorAll('.notShow');
    } else {
      elements = document.querySelectorAll('.show');
    }
    for (let i = 0; i < elements.length; i++) {
      if (!this.isOpenDays) {
        elements[i].classList.remove('notShow');
        elements[i].classList.add('show');
      } else {
        elements[i].classList.remove('show');
        elements[i].classList.add('notShow');
      }
    }
    if (!this.isOpenDays) {
      this.isOpenDays = true;
    } else {
      this.isOpenDays = false;
    }
  }

  showServices() {
    let elements;
    if (!this.isOpenServices) {
      elements = document.querySelectorAll('.notShowServices');
    } else {
      elements = document.querySelectorAll('.showServices');
    }
    for (let i = 0; i < elements.length; i++) {
      if (!this.isOpenServices) {
        elements[i].classList.remove('notShowServices');
        elements[i].classList.add('showServices');
      } else {
        elements[i].classList.remove('showServices');
        elements[i].classList.add('notShowServices');
      }
    }
    if (!this.isOpenServices) {
      this.isOpenServices = true;
    } else {
      this.isOpenServices = false;
    }
  }

  favoriteClinic() {
    if (this.userService.getUserLogin() == null || this.userService.getUserLogin() == '') {
      this.navCtrl.parent.select(4);
    } else {
      let url = "";
      switch (this.category) {
        case "Medicina":
          url = this.constants.API_URL + 'Client/AddFavoriteClinic';
          break;
        case "Peluquerias":
          url = this.constants.API_URL + 'Client/AddFavoriteHairdressing';
          break;
        case "Barberias":
          url = this.constants.API_URL + 'Client/AddFavoriteHairdressing';
          break;
        case "Esteticas":
          url = this.constants.API_URL + 'Client/AddFavoriteHairdressing';
          break;
      }

      let headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.userService.getUserToken(),
      });
      let options = {headers};
      this.http.post(url, {Id: this.id}, options).subscribe(
          (success: any) => {
            this.results[0].isFavorite = true;
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

  removeFavoriteClinic() {
    let url = "";
    switch (this.category) {
      case "Medicina":
        url = this.constants.API_URL + 'Client/RemoveFavoriteClinic';
        break;
      case "Peluquerias":
        url = this.constants.API_URL + 'Client/RemoveFavoriteHairdressing';
        break;
      case "Barberias":
        url = this.constants.API_URL + 'Client/RemoveFavoriteHairdressing';
        break;
      case "Esteticas":
        url = this.constants.API_URL + 'Client/RemoveFavoriteHairdressing';
        break;
    }
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userService.getUserToken(),
    });
    let options = {headers};
    this.http.post(url, {Id: this.id}, options).subscribe(
        (success: any) => {
          this.results[0].isFavorite = false;
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

  book() {
    var data = {
      id:       this.id,
      category: this.category,
      name:     this.results[0].name,
      address:  this.results[0].address,
      city:     this.results[0].city
    };

    this.navCtrl.push(ReservaPage, data);
  }

  showShare() {
    (document.querySelector('#backBlackReserva') as HTMLElement).style.visibility = 'visible';
    (document.querySelector('#backBlackReserva') as HTMLElement).style.opacity    = '0.7';

    let data = {id: this.id, rubro: 0};
    switch (this.category) {
      case "Medicina":
        data.rubro = 1;
        break;
      case "Peluquerias":
        data.rubro = 2;
        break;
      case "Barberias":
        data.rubro = 3;
        break;
      case "Esteticas":
        data.rubro = 4;
        break;
    }
    let shareModal = this.modalCtrl.create(SharePage, data);
    shareModal.onDidDismiss(data => {
      (document.querySelector('#backBlackReserva') as HTMLElement).style.visibility = 'hidden';
      (document.querySelector('#backBlackReserva') as HTMLElement).style.opacity = '0';
    });
    shareModal.present();
  }

}
