import { Component } from '@angular/core';

import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LoginPage;
  tab2Root = RegisterPage;

  constructor() {

  }
}
