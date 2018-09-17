import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LoginPage;
  tab2Root = AboutPage;

  constructor() {

  }
}
