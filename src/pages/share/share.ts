import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { Clipboard } from '@ionic-native/clipboard';
import * as moment from 'moment';

@Component({
  selector: 'share-hour',
  templateUrl: 'share.html'
})
export class SharePage {

  id;
  rubro;
  link;

  constructor(
      public navCtrl: NavController,
      private viewCtrl: ViewController,
      public alertCtrl: AlertController,
      public navParams: NavParams,
      private userService: UserService,
      private http: HttpClient,
      private constants: Constants,
      private clipboard: Clipboard
  ) {
    this.id = navParams.get("id");
    this.rubro = navParams.get("rubro");

    this.link = this.constants.baseUrlToSiteForShare;

    switch(this.rubro) {
      case 1:
        this.link += this.constants.clinicShareFolder;
        break;
      case 2:
        this.link += this.constants.hairdressingShareFolder;
        break;
      case 3:
        this.link += this.constants.hairdressingShareFolder;
        break;
      case 4:
        this.link += this.constants.hairdressingShareFolder;
        break;
    }

    this.link += this.id;
  }

  copyToClipboard() {
    this.clipboard.copy(this.link);
  }

  cancelData() {
    this.viewCtrl.dismiss({});
  }

}
