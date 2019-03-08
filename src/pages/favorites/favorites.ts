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

  public results = [];
  public resultsHair = [];
  public isSearching = false;

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
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.userService.getUserToken().then((tok) => {
          this.isSearching = true;
          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer ' + tok);
          let url = this.constants.API_URL + 'Client/GetFavorites';
          let options = {
            headers
          };
          this.http.get(url, options).subscribe(
              (success: any) => {
                this.results     = success.clinicFavorites;
                this.resultsHair = success.hairdressingFavorites;
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
      } else {
        this.navCtrl.parent.select(4);
      }
    });
  }

  goToClinicInfo(id, category) {
    let cat = "";
    if (category == "Medicina") {
      cat = category;
    } else {
      switch (category) {
        case 2:
          cat = "Peluquerias";
          break;
        case 3:
          cat = "Barberias";
          break;
        case 4:
          cat = "Esteticas";
          break;
      }
    }
    this.navCtrl.push(InfoclinicaPage, {
      id: id,
      category: cat
    });
  }

}
