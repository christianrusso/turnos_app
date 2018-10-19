import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';

@Component({
  selector: 'page-ayuda',
  templateUrl: 'ayuda.html'
})
export class AyudaPage {

  private category = "";
  private categories;
  private place = "";
  private days = [];
  private when = "";

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private http: HttpClient,
      private constants: Constants
  ) {
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

  openQuestion(id) {
    var answer = document.getElementById("answer" + id);
    if (answer.style.display == "block") {
      answer.style.display = "none";
    } else {
      answer.style.display = "block";
    }
  }

}
