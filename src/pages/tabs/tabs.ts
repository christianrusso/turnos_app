import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { FavoritesPage } from '../favorites/favorites';
import { TurnosPage } from '../turnos/turnos';
import { MisNotificacionesPage } from '../mis-notificaciones/misnotificaciones';
import { ProfilePage } from '../profile/profile';
import { UserService } from '../../services/user.service';

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

  constructor(
      private userService: UserService,
      public navCtrl: NavController
  ) {
    this.checkLogin();
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
}
