import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { configs } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { LoginPage } from '../login/login';
import { PreSearchPage } from '../pre-search/pre-search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  pages;
  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private http: HttpClient,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private userService: UserService,
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
