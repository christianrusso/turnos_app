import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { FiltrosDetailPage } from '../filtros-detail/filtros-detail';

@Component({
  selector: 'page-filtros',
  templateUrl: 'filtros.html'
})
export class FiltrosPage {

  constructor(
      public navCtrl: NavController,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService
  ) {
  }

  goToDetail(type) {
    this.navCtrl.push(FiltrosDetailPage, {
      type: type
    });
  }

}
