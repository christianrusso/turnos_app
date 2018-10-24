import { Component } from '@angular/core';
import { NavController, AlertController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-order',
  templateUrl: 'order.html'
})
export class OrderPage {

  private sort  = "";
  private order = "";

  constructor(
      public navCtrl: NavController,
      private viewCtrl: ViewController,
      public alertCtrl: AlertController
  ) {
  }

  select(sort, order) {
    this.sort  = sort;
    this.order = order;
    this.cancel();
  }

  cancel() {
    let data = {sort: this.sort, order: this.order};
    this.viewCtrl.dismiss(data);
  }

}
