import { Component } from '@angular/core';

import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = '';
  tab3Root = '';
  tab4Root = '';
  tab5Root = LoginPage;

  constructor() {

  }
}
