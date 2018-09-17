import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  data = {
    email: '',
    clave: '',
  }
  registerForm: FormGroup;

  constructor(
      public navCtrl: NavController,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService
  ) {
    this.registerForm = this.formBuilder.group({
      email:   [this.data['email'], [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      clave:   [this.data['clave'], Validators.required],
      reclave: [this.data['clave'], Validators.required]
    });
  }

  register() {
    if (this.registerForm.value.clave == this.registerForm.value.reclave) {
      let params = {Email: this.registerForm.value.email, Password: this.registerForm.value.clave};
      let d = new Date().getMilliseconds();
      let url = this.constants.API_URL + 'client/register';
      let msj = '';
      this.http.post(url, params).subscribe(
          (success: any) => {
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: 'Registro Exitoso',
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
    } else {
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: "La repetición de la clave debe ser identica a la original",
        buttons: ['OK']
      });
      alert.present();
    }
  }

}
