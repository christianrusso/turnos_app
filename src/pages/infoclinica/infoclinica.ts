import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import * as moment from 'moment';
import { UserService } from '../../services/user.service';
import { ReservaPage } from '../reserva/reserva';

declare var google: any;

@Component({
  selector: 'page-infoclinica',
  templateUrl: 'infoclinica.html'
})
export class InfoclinicaPage {

  private id = "";
  private results;
  private moment = moment();
  private day;
  private isOpenDays = false;
  map:any;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants,
      private userService: UserService
  ) {
    this.id = navParams.get("id");
    this.day = this.moment.day();
  }

  ionViewWillEnter() {
    this.search();
  }

  search() {
    let headers = new HttpHeaders();
    if (this.userService.getUserLogin() != null && this.userService.getUserLogin() != '') {
      headers = headers.set('Authorization', 'Bearer ' + this.userService.getUserToken())
    }
    let url = this.constants.API_URL + 'Clinic/GetByFilter';
    let options = {
      "clinicId": this.id,
      "Cities": [],
      "Specialties": [],
      "Subspecialties": [],
      "MedicalInsurances": [],
      "medicalPlans": [],
      "Score": "",
      "ScoreQuantity": ""
    };
    this.http.post(url, options, {headers}).subscribe(
        (success: any) => {
          this.results = success;
          this.loadMap(success[0].latitude, success[0].longitude);
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

  loadMap(lat, lng){
    let latitude = lat;
    let longitude = lng;

    setTimeout(() => {
      // create a new map by passing HTMLElement
      let mapEle: HTMLElement = document.getElementById('map');

      // create LatLng object
      var latlng = new google.maps.LatLng(latitude, longitude);

      // create map
      this.map = new google.maps.Map(mapEle, {
        center: latlng,
        zoom: 14
      });

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        let marker = new google.maps.Marker({
          position: latlng,
          map: this.map
        });
      });
    }, 1000);
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

  favoriteClinic() {
    if (this.userService.getUserLogin() == null || this.userService.getUserLogin() == '') {
      this.navCtrl.parent.select(4);
    } else {
      let url = this.constants.API_URL + 'Client/AddFavoriteClinic';
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
    let url = this.constants.API_URL + 'Client/RemoveFavoriteClinic';
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
      clinicId:      this.id,
      clinicName:    this.results[0].name,
      clinicAddress: this.results[0].address,
      clinicCity:    this.results[0].city
    };

    this.navCtrl.push(ReservaPage, data);
  }

}
