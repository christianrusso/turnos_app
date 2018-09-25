import { Component } from '@angular/core';

import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = '';
  tab2Root = '';
  tab3Root = '';
  tab4Root = '';
  tab5Root = LoginPage;

  constructor() {

  }
}
