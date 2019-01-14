import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import * as moment from 'moment';

@Component({
  selector: 'page-complete-turno',
  templateUrl: 'complete-turno.html'
})
export class CompleteTurnoPage {

  comment;
  score = 1;

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
    let data = {comment: this.comment, score: this.score};
    this.viewCtrl.dismiss(data);
  }

  cancelData() {
    this.viewCtrl.dismiss({});
  }

}
