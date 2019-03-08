import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { FavoritesPage } from '../favorites/favorites';
import { TurnosPage } from '../turnos/turnos';
import { MisNotificacionesPage } from '../mis-notificaciones/misnotificaciones';
import { ProfilePage } from '../profile/profile';
import { UserService } from '../../services/user.service';
import {Constants} from "../../app/constants";
import {HttpHeaders} from "@angular/common/http";
import {HttpClient} from "@angular/common/http";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FavoritesPage;
  tab3Root = TurnosPage;
  tab4Root = MisNotificacionesPage;
  tab5Root = LoginPage;
  tab6Root = ProfilePage;
  myIndex = 0;
  showProfile = false;
  public quantity = 0;

  constructor(
      private userService: UserService,
      public navCtrl: NavController,
      public constants: Constants,
      public http: HttpClient
  ) {
    this.checkLogin();
    this.search();
  }

  checkLogin() {
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.showProfile = true;
      } else {
        this.showProfile = false;
      }
    })
  }

  search() {
    let headers = new HttpHeaders();
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.userService.getUserToken().then((tok) => {
          headers = headers.set('Authorization', 'Bearer ' + tok);
          let url = this.constants.API_URL + 'Client/GetWeekForClient';
          let options = {
            "startDate": new Date(),
            "endDate": new Date()
          };
          this.quantity = 0;
          this.http.post(url, options, {headers}).subscribe(
              (success: any) => {
                var clinics = success.clinic_GetWeekForClient;
                var hairdress = success.hairdressing_GetWeekForClient;
                clinics.forEach(element => {
                  if (element.appointments.length > 0) {
                    element.appointments.forEach(appoint => {
                      this.quantity++;
                    })
                  }
                })
                hairdress.forEach(element => {
                  if (element.appointments.length > 0) {
                    element.appointments.forEach(appoint => {
                      this.quantity++;
                    })
                  }
                })
              },
              error => {
              }
          );
        });
      }
    });
  }

  resetQuantity() {
    this.quantity = 0;
  }
}
