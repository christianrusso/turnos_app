import { Component } from '@angular/core';
import { NavController, AlertController, Tabs } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { RegisterPage } from '../register/register';
import { AyudaPage } from '../ayuda/ayuda';
import {ProfilePage} from "../profile/profile";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  data = {
    email: '',
    clave: '',
  }
  loginForm: FormGroup;

  constructor(
      public navCtrl: NavController,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService,
      private tab: Tabs
  ) {
    this.loginForm = this.formBuilder.group({
      email: [this.data['email'], Validators.required],
      clave: [this.data['clave'], Validators.required],
    });
  }

  ionViewWillEnter() {
    this.checkLogin();
  }

  checkLogin() {
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.navCtrl.push(ProfilePage);
      }
    })
  }

  login() {
    let params = {Email: this.loginForm.value.email, Password: this.loginForm.value.clave};
    let d = new Date().getMilliseconds();
    let url = this.constants.API_URL + 'account/login';
    let msj = '';
    this.http.post(url, params).subscribe(
      (success: any) => {
        this.userService.setUserLogin(this.loginForm.value.email);
        this.userService.setUserToken(success.token);
        this.userService.setUserImage(success.logo);
        this.goToHome();
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

  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }

  goToAyuda() {
    this.navCtrl.push(AyudaPage);
  }

  goToHome() {
    this.tab.select(0);
  }

}
