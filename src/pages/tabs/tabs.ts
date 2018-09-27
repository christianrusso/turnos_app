import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { UserService } from '../../services/user.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = '';
  tab3Root = '';
  tab4Root = '';
  tab5Root = LoginPage;
  tab6Root = ProfilePage;
  myIndex = 0;

  constructor(
      private userService: UserService,
      public navCtrl: NavController
  ) {
  }

  checkLogin() {
    if (this.userService.getUserLogin() != null && this.userService.getUserLogin() != "") {
      this.myIndex = 5;
    }
  }
}
