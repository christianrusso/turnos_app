import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-cuenta',
  templateUrl: 'cuenta.html'
})
export class CuentaPage {

  image;
  username;
  isEditing = false;

  constructor(
      public navCtrl: NavController,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService
  ) {
    if (this.userService.getUserImage() != null) {
      this.image = this.userService.getUserImage();
    } else {
      this.image = "/assets/icon/user.jpg";
    }
    this.username = this.userService.getUserLogin();
  }

  enableEdit() {
    this.isEditing = true;
  }

}
