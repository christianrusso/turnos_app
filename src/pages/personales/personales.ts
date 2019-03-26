import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-personales',
  templateUrl: 'personales.html'
})
export class PersonalesPage {

  isEditing = false;
  firstName;
  lastName;
  address;
  email;
  phone;

  constructor(
      public navCtrl: NavController,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService
  ) {
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
          let url = this.constants.API_URL + 'Client/Edit';
          let options = {
            "FirstName": this.firstName,
            "LastName": this.lastName,
            "Address": this.address,
            "PhoneNumber": this.phone,
            "Email": this.email
          };
          this.http.post(url, options, {headers}).subscribe(
              (success: any) => {
                this.isEditing = false;
                let alert = this.alertCtrl.create({
                  subTitle: "Datos modificados con exito",
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
          headers = headers.set('Authorization', 'Bearer ' + tok);
          let url = this.constants.API_URL + 'Client/GetProfile';
          let options = {
            headers: headers
          };
          this.http.get(url, options).subscribe(
              (success: any) => {
                this.firstName = success.firstName;
                this.lastName = success.lastName;
                this.address = success.address;
                this.phone = success.phoneNumber;
                this.email = value;
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

}
