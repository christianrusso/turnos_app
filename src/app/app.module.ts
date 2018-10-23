import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { AboutPage } from '../pages/about/about';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { PreSearchPage } from '../pages/pre-search/pre-search';
import { InfoclinicaPage } from '../pages/infoclinica/infoclinica';
import { SearchPage } from '../pages/search/search';
import { AyudaPage } from '../pages/ayuda/ayuda';
import { OrderPage } from '../pages/order/order';
import { FavoritesPage } from '../pages/favorites/favorites';
import { Constants } from '../app/constants';
import { UserService } from "../services/user.service";
import { CalendarModule } from "ion2-calendar";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {IonicStorageModule} from "@ionic/storage";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    RegisterPage,
    LoginPage,
    HomePage,
    ProfilePage,
    TabsPage,
    PreSearchPage,
    SearchPage,
    InfoclinicaPage,
    AyudaPage,
    FavoritesPage,
    OrderPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule,
    CalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    RegisterPage,
    LoginPage,
    HomePage,
    TabsPage,
    ProfilePage,
    PreSearchPage,
    SearchPage,
    InfoclinicaPage,
    AyudaPage,
    FavoritesPage,
    OrderPage
  ],
  providers: [
    Constants,
    UserService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
