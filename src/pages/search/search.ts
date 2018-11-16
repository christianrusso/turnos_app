import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { InfoclinicaPage } from '../infoclinica/infoclinica';
import { OrderPage } from '../order/order';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';

declare var google: any;

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  private category = "";
  public  results;
  private place = "";
  private AvailableAppointmentStartDate = "";
  private AvailableAppointmentEndDate = "";
  private sort;
  private order;
  public from = 0;
  public showLoading = true;
  public actualClinics: any;
  public isListado = true;
  map:any;
  public infoName;
  public infoCity;
  public infoComments;
  public infoRating;
  public infoLogo;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants,
      public modalCtrl: ModalController
  ) {
    this.category = navParams.get("category")[0].toUpperCase() + navParams.get("category").slice(1).toLowerCase();
    this.place    = navParams.get("place");
    this.AvailableAppointmentStartDate = navParams.get("AvailableAppointmentStartDate");
    this.AvailableAppointmentEndDate = navParams.get("AvailableAppointmentEndDate");

    this.search(false);
  }

  goToClinicInfo(id) {
    this.navCtrl.push(InfoclinicaPage, {
      id: id
    });
  }

  showOrder() {
    (document.querySelector('#backBlack') as HTMLElement).style.visibility = 'visible';
    (document.querySelector('#backBlack') as HTMLElement).style.opacity    = '0.7';
    let orderModal = this.modalCtrl.create(OrderPage);
    orderModal.onDidDismiss(data => {
      this.sort  = data.sort;
      this.order = data.order;
      if (data.sort != '') {
        this.search(false);
      }
      (document.querySelector('#backBlack') as HTMLElement).style.visibility = 'hidden';
      (document.querySelector('#backBlack') as HTMLElement).style.opacity    = '0';
    });
    orderModal.present();
  }

  search(page) {
    this.showLoading = true;
    let url = this.constants.API_URL + 'Clinic/GetByFilter';
    let cities = [];
    if (this.place != "" && this.place != null) {
      cities.push(this.place.toString());
    }
    let options = {
      "Cities": cities,
      "Specialties": [],
      "Subspecialties": [],
      "MedicalInsurances": [],
      "medicalPlans": [],
      "Score": "",
      "ScoreQuantity": "",
      "AvailableAppointmentStartDate": this.AvailableAppointmentStartDate,
      "AvailableAppointmentEndDate": this.AvailableAppointmentEndDate,
      "SortField": "",
      "AscendingOrder": "",
      "From": 0,
      "to": 0
    };
    if (this.sort != 'undefined' && this.sort != "") {
      options.SortField = this.sort;
    }
    if (this.order != 'undefined' && this.order != "") {
      options.AscendingOrder = this.order;
    }
    if (page != 'undefined' && page == true) {
      options.to = this.from;
      this.actualClinics = this.results.length;
    } else {
      this.results = null;
      this.actualClinics = 0;
      this.from = 0;
      options.to = this.constants.quantityOfResultsToShow;
    }
    this.http.post(url, options).subscribe(
        (success: any) => {
          this.results = success;
          if (this.from == 0) {
            this.from = this.from + success.length + this.constants.quantityOfResultsToShow;
          } else {
            this.from = this.from + (success.length - this.actualClinics);
          }
          if ((success.length - this.actualClinics) == this.constants.quantityOfResultsToShow) {
            (document.querySelector('#verMasButton') as HTMLElement).style.display = 'block';
          } else {
            (document.querySelector('#verMasButton') as HTMLElement).style.display = 'none';
          }
          this.showLoading = false;
        },
        error => {
          console.log(error);
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: error.error,
            buttons: ['OK']
          });
          alert.present();
          this.showLoading = false;
        }
    );
  }

  showMap() {
    this.isListado = false;
    this.loadMap(-34.533092, -58.479169);
  }

  showListado() {
    (document.querySelector('#data') as HTMLElement).style.height = '';
    this.isListado = true;
  }

  loadMap(lat, lng){
    let latitude = lat;
    let longitude = lng;

    (document.querySelector('#data') as HTMLElement).style.height = '100%';

    setTimeout(() => {
      // create a new map by passing HTMLElement
      let mapEle: HTMLElement = document.getElementById('map');

      // create LatLng object
      var latlng = new google.maps.LatLng(-34.5432596, 5.76293);

      // create map
      this.map = new google.maps.Map(mapEle, {
        center: latlng,
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true
      });

      var bounds = new google.maps.LatLngBounds();

      var that = this;

      for (var i = 0; i < this.results.length; i++) {
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.results[i].latitude, this.results[i].longitude),
          map: this.map,
          name:     this.results[i].name,
          logo:     this.results[i].logo,
          city:     this.results[i].city,
          score:    this.results[i].score,
          comments: this.results[i].ratings
        });
        google.maps.event.addListener(marker, 'click', function (event) {
          that.setInfoData(marker);
        });
        bounds.extend(new google.maps.LatLng(this.results[i].latitude, this.results[i].longitude));
      }

      // Fit these bounds to the map
      this.map.fitBounds(bounds);
      this.map.panToBounds(bounds);
      //this.map.setZoom(12);
    }, 1000);
  }

  setInfoData(data) {
    this.infoName     = data.name;
    this.infoLogo     = data.logo;
    this.infoCity     = data.city;
    this.infoRating   = data.score;
    this.infoComments = data.comments;
  }

}
