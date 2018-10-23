import { Component } from '@angular/core';
import { NavController, AlertController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-order',
  templateUrl: 'order.html'
})
export class OrderPage {

  constructor(
      public navCtrl: NavController,
      private viewCtrl: ViewController,
      public alertCtrl: AlertController
  ) {
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

}
