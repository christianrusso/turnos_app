import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController, Nav, Platform } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import * as moment from 'moment';
import { UserService } from '../../services/user.service';
import { ReservaPage } from '../reserva/reserva';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Deeplinks } from "@ionic-native/deeplinks/ngx";

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
  providers :[LaunchNavigator, Deeplinks]
})
export class InfoPage {

  private id = "";
  private category;
  private results;
  private moment = moment();
  private day;
  private isOpenDays = false;
  private isOpenServices = false;
  map:any;
  destinationPoint : any;
  private link;
  @ViewChild(Nav) navChild:Nav;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants,
      private userService: UserService,
      public modalCtrl: ModalController,
      private launchNavigator: LaunchNavigator,
      private socialSharing: SocialSharing,
      private deeplinks: Deeplinks,
      private platform: Platform
  ) {
    this.id = navParams.get("id");
    this.category = navParams.get("category");
    this.day = this.moment.day();

    platform.ready().then(() => {
      /*this.deeplinks.routeWithNavController(this.navChild, {
        '/info': this
      }).subscribe((match) => {
        console.log('Successfully routed', match);
      }, (nomatch) => {
        console.warn('Unmatched Route', nomatch);
      });*/
    });
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
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.userService.getUserToken().then((tok) => {
          headers = headers.set('Authorization', 'Bearer ' + tok);
          this.doSearch(headers);
        });
      } else {
        this.doSearch(headers);
      }
    });
  }

  doSearch(headers) {
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
          console.log(this.results);
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
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
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

        this.userService.getUserToken().then((tok) => {
          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer ' + tok);
          let options = {headers};
          this.http.post(url, {Id: this.id}, options).subscribe(
              (success: any) => {
                this.results[0].isFavorite = true;

                let alert = this.alertCtrl.create({
                  title: '',
                  subTitle: "El centro fue agregado a su lista de favoritos!",
                  buttons: ['OK']
                });
                alert.present();
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
      } else {
        this.navCtrl.parent.select(4);
      }
    });
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
    this.userService.getUserToken().then((tok) => {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + tok);
      let options = {headers};
      this.http.post(url, {Id: this.id}, options).subscribe(
          (success: any) => {
            this.results[0].isFavorite = false;

            let alert = this.alertCtrl.create({
              title: '',
              subTitle: "El centro fue eliminado de su lista de favoritos!",
              buttons: ['OK']
            });
            alert.present();
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
    //(document.querySelector('#backBlackReserva') as HTMLElement).style.visibility = 'visible';
    //(document.querySelector('#backBlackReserva') as HTMLElement).style.opacity    = '0.7';

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

    this.link = "";

    switch(data.rubro) {
      case 1:
        this.link += this.constants.clinicShareFolder;
        break;
      case 2:
        this.link += this.constants.hairdressingShareFolder;
        break;
      case 3:
        this.link += this.constants.hairdressingShareFolder;
        break;
      case 4:
        this.link += this.constants.hairdressingShareFolder;
        break;
    }

    this.link += this.id;

    this.socialSharing.share(this.results[0].name + " - " + this.results[0].address, null, null, this.link).then(() => {
    }).catch(() => {
    });
  }

}