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
import { NotificacionesPage } from '../pages/notificaciones/notificaciones';
import { OrderPage } from '../pages/order/order';
import { FavoritesPage } from '../pages/favorites/favorites';
import { NotpacientPage } from '../pages/not-pacient/notpacient';
import { Constants } from '../app/constants';
import { UserService } from "../services/user.service";
import { FiltersService } from "../services/filters.service";
import { TurnosPage } from '../pages/turnos/turnos';
import { MisNotificacionesPage } from '../pages/mis-notificaciones/misnotificaciones';
import { PersonalesPage } from '../pages/personales/personales';
import { CuentaPage } from '../pages/cuenta/cuenta';
import { HourPage } from '../pages/hour/hour';
import { CancelTurnoPage } from '../pages/cancel-turno/cancel-turno';
import { CompleteTurnoPage } from '../pages/complete-turno/complete-turno';
import { ReservaGeneradaPage } from '../pages/reserva-generada/reserva-generada';
import { FiltrosPage } from '../pages/filtros/filtros';
import { FiltrosDetailPage } from '../pages/filtros-detail/filtros-detail';
import { ReservaPage } from '../pages/reserva/reserva';
import { CalendarModule } from "ion2-calendar";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {IonicStorageModule} from "@ionic/storage";
import { Geolocation } from '@ionic-native/geolocation';

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
    OrderPage,
    TurnosPage,
    CuentaPage,
    PersonalesPage,
    NotificacionesPage,
    ReservaPage,
    HourPage,
    CancelTurnoPage,
    CompleteTurnoPage,
    FiltrosPage,
    FiltrosDetailPage,
    ReservaGeneradaPage,
    MisNotificacionesPage,
    NotpacientPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back',
      iconMode: 'ios',
      tabsPlacement: 'bottom'
    }),
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
    OrderPage,
    TurnosPage,
    CuentaPage,
    PersonalesPage,
    NotificacionesPage,
    ReservaPage,
    HourPage,
    CancelTurnoPage,
    CompleteTurnoPage,
    FiltrosPage,
    FiltrosDetailPage,
    ReservaGeneradaPage,
    MisNotificacionesPage,
    NotpacientPage
  ],
  providers: [
    Constants,
    UserService,
    FiltersService,
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
