import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { InfoclinicaPage } from '../infoclinica/infoclinica';
import { OrderPage } from '../order/order';
import { FiltrosPage } from '../filtros/filtros';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { FiltersService } from '../../services/filters.service';
import * as moment from 'moment';
import { Geolocation } from '@ionic-native/geolocation';

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
      public modalCtrl: ModalController,
      public filtersService: FiltersService,
      private geolocation: Geolocation
  ) {
    if (navParams.get("category")) {
      this.category = navParams.get("category")[0].toUpperCase() + navParams.get("category").slice(1).toLowerCase();
      this.filtersService.category = this.category;
      this.place    = navParams.get("place");
      this.AvailableAppointmentStartDate = navParams.get("AvailableAppointmentStartDate");
      this.AvailableAppointmentEndDate = navParams.get("AvailableAppointmentEndDate");
      this.filtersService.specialities = [];
      this.filtersService.subspecialities = [];
      this.filtersService.stars = 0;
      this.filtersService.distance = 0;
      this.filtersService.locations = [];
      this.filtersService.score = 0;
      this.filtersService.obrassociales = [];
    } else {
      this.category = this.filtersService.category;
      this.AvailableAppointmentStartDate = moment().format('YYYY-MM-DD');
      this.AvailableAppointmentEndDate = moment().add(14, 'days').format('YYYY-MM-DD');
    }

    this.search(false);
  }

  goToClinicInfo(id) {
    this.navCtrl.push(InfoclinicaPage, {
      id: id
    });
  }

  goToFilters() {
    this.navCtrl.push(FiltrosPage);
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
      "Score": 0,
      "ScoreQuantity": 0,
      "Stars": 0,
      "AvailableAppointmentStartDate": this.AvailableAppointmentStartDate,
      "AvailableAppointmentEndDate": this.AvailableAppointmentEndDate,
      "SortField": "",
      "AscendingOrder": "",
      "From": 0,
      "to": 0,
      "location": {
        "latitude": 0,
        "longitude": 0,
        "radiusInMeters": 0
      }
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
    if (this.filtersService.specialities.length > 0) {
      for (var i = 0; i < this.filtersService.specialities.length; i++) {
        if (this.filtersService.specialities[i].checked == true) {
          options.Specialties.push(this.filtersService.specialities[i].id);
        }
      }
    }
    if (this.filtersService.subspecialities.length > 0) {
      for (var i = 0; i < this.filtersService.subspecialities.length; i++) {
        if (this.filtersService.subspecialities[i].checked == true) {
          options.Subspecialties.push(this.filtersService.subspecialities[i].id);
        }
      }
    }
    if (this.filtersService.locations.length > 0) {
      for (var i = 0; i < this.filtersService.locations.length; i++) {
        if (this.filtersService.locations[i].checked == true) {
          options.Cities.push(this.filtersService.locations[i].id);
        }
      }
    }
    if (this.filtersService.obrassociales.length > 0) {
      for (var i = 0; i < this.filtersService.obrassociales.length; i++) {
        if (this.filtersService.obrassociales[i].checked == true) {
          options.MedicalInsurances.push(this.filtersService.obrassociales[i].id);
        }
      }
    }
    if (this.filtersService.score > 0) {
      options.Score = this.filtersService.score;
    }
    if (this.filtersService.stars > 0) {
      options.Stars = this.filtersService.stars;
    }
    this.geolocation.getCurrentPosition().then((resp) => {
      options.location.latitude = resp.coords.latitude;
      options.location.longitude = resp.coords.longitude;
      if (this.filtersService.distance > 0) {
        options.location.radiusInMeters = this.filtersService.distance * 1000;
      } else {
        delete options.location;
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
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  showMap() {
    this.isListado = false;
    this.loadMap(-34.533092, -58.479169);
  }

  showListado() {
    this.isListado = true;
  }

  loadMap(lat, lng){
    let latitude = lat;
    let longitude = lng;

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
      var markers = [];

      for (var i = 0; i < this.results.length; i++) {
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.results[i].latitude, this.results[i].longitude),
          map:      this.map,
          name:     this.results[i].name,
          logo:     this.results[i].logo,
          city:     this.results[i].city,
          score:    this.results[i].score,
          comments: this.results[i].ratings,
          icon:     '/assets/icon/marker.png'
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function (event) {
          for (var j = 0; j < markers.length; j++) {
            markers[j].setIcon('/assets/icon/marker.png');
          }
          that.setInfoData(marker);
          marker.setIcon('/assets/icon/marker_selected.png');
          this.map.setCenter(marker.getPosition());
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
