import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { InfoclinicaPage } from '../infoclinica/infoclinica';
import { OrderPage } from '../order/order';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';

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

    this.search();
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
        this.search();
      }
      (document.querySelector('#backBlack') as HTMLElement).style.visibility = 'hidden';
      (document.querySelector('#backBlack') as HTMLElement).style.opacity    = '0';
    });
    orderModal.present();
  }

  search() {
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
      "AscendingOrder": ""
    };
    if (this.sort != 'undefined' && this.sort != "") {
      options.SortField = this.sort;
    }
    if (this.order != 'undefined' && this.order != "") {
      options.AscendingOrder = this.order;
    }
    this.http.post(url, options).subscribe(
        (success: any) => {
          console.log(success);
          this.results = success;
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
