import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { configs } from '../../app/constants';
import { LoginPage } from '../login/login';
import { PreSearchPage } from '../pre-search/pre-search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  pages: Array<{
    name: string;
    image: string;
    route: string
  }>;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.pages = configs.pages;
  }
  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

  goToPreSearch(category) {
    this.navCtrl.push(PreSearchPage, {
      category: category
    });
  }

}
