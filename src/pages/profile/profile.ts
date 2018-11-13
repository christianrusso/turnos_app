import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { CuentaPage } from '../cuenta/cuenta';
import { PersonalesPage } from '../personales/personales';
import { NotificacionesPage } from '../notificaciones/notificaciones';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(
      public navCtrl: NavController,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService
  ) {
  }

  goToReservas() {
    this.navCtrl.parent.select(2);
  }

  openCuenta() {
    if (document.getElementById("cuenta").style.display == "table-row") {
      document.getElementById("cuenta").style.display = "none";
    } else {
      document.getElementById("cuenta").style.display = "table-row";
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
