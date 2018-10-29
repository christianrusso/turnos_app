import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { InfoclinicaPage } from '../infoclinica/infoclinica';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {

  public  results;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants,
      private userService: UserService
  ) {
  }

  ionViewDidEnter() {
    this.checkLogin();
  }

  checkLogin() {
    if (this.userService.getUserLogin() == null || this.userService.getUserLogin() == '') {
      this.navCtrl.parent.select(4);
    } else {
      let url = this.constants.API_URL + 'Client/GetFavoriteClinics';
      let cities = [];
      let headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.userService.getUserToken(),
      });
      let options = {
        "Cities": cities,
        "Specialties": [],
        "Subspecialties": [],
        "MedicalInsurances": [],
        "medicalPlans": [],
        "Score": "",
        "ScoreQuantity": "",
        headers
      };
      this.http.get(url, options).subscribe(
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

  goToClinicInfo(id) {
    this.navCtrl.push(InfoclinicaPage, {
      id: id
    });
  }

}
