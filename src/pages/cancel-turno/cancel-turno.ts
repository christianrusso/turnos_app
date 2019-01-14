import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import * as moment from 'moment';

@Component({
  selector: 'page-cancel-turno',
  templateUrl: 'cancel-turno.html'
})
export class CancelTurnoPage {

  motivo;

  constructor(
      public navCtrl: NavController,
      private viewCtrl: ViewController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private userService: UserService,
      private http: HttpClient,
      private constants: Constants
  ) {
  }

  returnData() {
    let data = {motivo: this.motivo};
    this.viewCtrl.dismiss(data);
  }

  cancelData() {
    this.viewCtrl.dismiss({});
  }

}
