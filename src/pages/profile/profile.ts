import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { CuentaPage } from '../cuenta/cuenta';
import { PersonalesPage } from '../personales/personales';
import { NotificacionesPage } from '../notificaciones/notificaciones';
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public showCuenta = false;

  constructor(
      public navCtrl: NavController,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService
  ) {
  }

  ionViewWillEnter() {
    this.checkLogin();
  }

  checkLogin() {
    this.userService.getUserLogin().then((value) => {
      if (value == null) {
        this.navCtrl.push(LoginPage);
      }
    })
  }

  goToReservas() {
    this.navCtrl.parent.select(2);
  }

  openCuenta() {
    if (this.showCuenta == true) {
      this.showCuenta = false;
    } else {
      this.showCuenta = true;
    }
  }

  openDatosDeCuenta() {
    this.navCtrl.push(CuentaPage);
  }

  openDatosPersonales() {
    this.navCtrl.push(PersonalesPage);
  }

  openNotificaciones() {
    this.navCtrl.push(NotificacionesPage);
  }

  closeSession() {
    this.userService.destroyUserLogin();
    this.navCtrl.parent.select(0);
  }

}
