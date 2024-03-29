import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  data = {
    username:    '',
    clave:    '',
    nombre:   '',
    apellido: '',
    reclave:  ''
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
      nombre:   [this.data['nombre'], Validators.required],
      apellido: [this.data['apellido'], Validators.required],
      clave:    [this.data['clave'], Validators.required],
      reclave:  [this.data['reclave'], Validators.required],
      username:  [this.data['username'], Validators.required]
    });
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

  register() {
      if (this.registerForm.value.clave.length >= 6) {
        if (this.registerForm.value.clave == this.registerForm.value.reclave) {
          let params = {
            username: this.registerForm.value.username,
            password: this.registerForm.value.clave,
            firstName: this.registerForm.value.nombre,
            lastName: this.registerForm.value.apellido
          };
          let d = new Date().getMilliseconds();
          let url = this.constants.API_URL + 'client/register';
          let msj = '';
          this.http.post(url, params).subscribe(
              (success: any) => {
                let alert = this.alertCtrl.create({
                  title: '',
                  subTitle: 'Registro Exitoso',
                  buttons: ['OK']
                });
                alert.present();
                this.goToLogin();
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
      } else {
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: "La contraseña debe contener al menos 6 caracteres",
          buttons: ['OK']
        });
        alert.present();
      }
  }

}
