import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { LoginPage } from '../login/login';
import { PreSearchPage } from '../pre-search/pre-search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private http: HttpClient,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private constants: Constants,
    private userService: UserService,
  ) { }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

  goToPreSearch(category) {
    this.navCtrl.push(PreSearchPage, {
      category: category
    });
  }

}
