import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-cuenta',
  templateUrl: 'cuenta.html'
})
export class CuentaPage {

  image;
  username;
  isEditing = false;
  actualPassword;
  newPassword;

  constructor(
      public navCtrl: NavController,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService
  ) {
    this.userService.getUserImage().then((value) => {
      if (value == null) {
        this.image = "/assets/icon/user.jpg";
      } else {
        this.image = value;
      }
    });
    this.userService.getUserLogin().then((value) => {
      this.username = value;
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  sendData() {
    let headers = new HttpHeaders();
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.userService.getUserToken().then((tok) => {
          headers = headers.set('Authorization', 'Bearer ' + tok);
          let url = this.constants.API_URL + 'Account/Edit';
          let options = {
            "email": this.username,
            "oldPassword": this.actualPassword,
            "newPassword": this.newPassword
          };
          this.http.post(url, options, {headers}).subscribe(
              (success: any) => {
                this.isEditing = false;
                let alert = this.alertCtrl.create({
                  subTitle: "Contraseña modificada con exito",
                  buttons: ['OK']
                });
                alert.present();
              },
              error => {
                console.log(error);
                let alert = this.alertCtrl.create({
                  title: 'Error!',
                  subTitle: error.error,
                  buttons: ['OK']
                });
                alert.present();
              }
          );
        });
      }
    });
  }

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    let headers = new HttpHeaders();
    this.userService.getUserLogin().then((value) => {
      if (value != null) {
        this.userService.getUserToken().then((tok) => {
          headers = headers.set('Authorization', 'Bearer ' + tok)
          this.getProfile(headers);
        });
      }
    });
  }

  getProfile(headers) {
    let url = this.constants.API_URL + 'Client/GetProfile';
    let options = {
      headers: headers
    };
    this.http.get(url, options).subscribe(
        (success: any) => {
          this.image = success.logo;
          if (this.image == null) {
            this.image = "/assets/icon/user.jpg";
          }
        },
        error => {
          console.log(error);
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: error.error,
            buttons: ['OK']
          });
          alert.present();
        }
    );
  }

}
