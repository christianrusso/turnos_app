import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';
import { CalendarModalOptions, DayConfig, CalendarModal } from "ion2-calendar";
import { HourPage } from '../hour/hour';

@Component({
  selector: 'page-reserva-generada',
  templateUrl: 'reserva-generada.html'
})
export class ReservaGeneradaPage {

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private constants: Constants,
      private userService: UserService,
      public modalCtrl: ModalController
  ) {
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }

}
