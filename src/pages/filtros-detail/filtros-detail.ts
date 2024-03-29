import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/constants';
import { UserService } from '../../services/user.service';
import { FiltersService } from '../../services/filters.service';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-filtros-detail',
  templateUrl: 'filtros-detail.html'
})
export class FiltrosDetailPage {

  type;
  category;
  specialities = [];
  subspecialities = [];
  subspecialitiesAll = [];
  obrassociales = [];
  distancia = 0;
  puntuacion = 0.0;
  ubicaciones = [];
  star = [
    {value:1, checked: false},
    {value:2, checked: false},
    {value:3, checked: false},
    {value:4, checked: false},
    {value:5, checked: false}
  ];
  public searchKeyword;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private http: HttpClient,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private constants: Constants,
      private userService: UserService,
      public filtersService: FiltersService
  ) {
  }

  ionViewWillEnter() {
    this.type = this.navParams.get("type");
    this.category = this.navParams.get("category");
    this.specialities = this.filtersService.specialities;
    this.subspecialities = this.filtersService.subspecialities;
    this.obrassociales = this.filtersService.obrassociales;
    this.ubicaciones = this.filtersService.locations;
    this.distancia = this.filtersService.distance;
    this.puntuacion = this.filtersService.score * 2;
    this.star = this.filtersService.stars;
    if (this.type == 'especialidades' || this.type == 'subespecialidades' || this.type == 'obrasocial' || this.type == 'ubicacion') {
      this.searchData();
    }
  }

  ionViewWillLeave() {
    this.filtersService.specialities = this.specialities;
  }

  searchData() {
    var url = "";
    var options = {};
    if (this.type == 'especialidades') {
      url = this.constants.API_URL + 'Data/GetSpecialtiesForSelect';
      options = {
        "Id": 1
      };
      switch (this.category) {
        case "Medicina":
          options["Id"] = 1;
          break;
        case "Peluquerias":
          options["Id"] = 2;
          break;
        case "Barberias":
          options["Id"] = 3;
          break;
        case "Esteticas":
          options["Id"] = 4;
          break;
      }
    }
    if (this.type == 'subespecialidades') {
      url = this.constants.API_URL + 'Data/GetSubspecialtiesForSelect';
      var subChecked = [];
      for (var i = 0; i < this.specialities.length; i++) {
        if (this.specialities[i].checked == true) {
          subChecked.push(this.specialities[i].id);
        }
      }
      options = {
        "rubro": 1,
        "ids": subChecked
      };
      switch (this.category) {
        case "Medicina":
          options["rubro"] = 1;
          break;
        case "Peluquerias":
          options["rubro"] = 2;
          break;
        case "Barberias":
          options["rubro"] = 3;
          break;
        case "Esteticas":
          options["rubro"] = 4;
          break;
      }
    }
    if (this.type == 'obrasocial') {
      url = this.constants.API_URL + 'Data/GetMedicalInsurancesForSelect';
    }
    if (this.type == 'ubicacion') {
      url = this.constants.API_URL + 'Data/GetCitiesForSelect';
    }
    this.http.post(url, options).subscribe(
        (success: any) => {
          if (this.type == 'especialidades' && this.filtersService.specialities.length == 0) {
            this.specialities = success;
            for (var i = 0; i < this.specialities.length; i++) {
              this.specialities[i].checked = false;
            }
            this.specialities.sort(this.compare);
          }
          if (this.type == 'subespecialidades') {
            this.subspecialities = success;
            for (var i = 0; i < this.subspecialities.length; i++) {
              this.subspecialities[i].checked = false;
            }
            this.subspecialities.sort(this.compare);
            this.subspecialitiesAll = this.subspecialities;
          }
          if (this.type == 'obrasocial' && this.filtersService.obrassociales.length == 0) {
            this.obrassociales = success;
            for (var i = 0; i < this.obrassociales.length; i++) {
              this.obrassociales[i].checked = false;
            }
            this.obrassociales.sort(this.compare);
          }
          if (this.type == 'ubicacion' && this.filtersService.locations.length == 0) {
            this.ubicaciones = success;
            for (var i = 0; i < this.ubicaciones.length; i++) {
              this.ubicaciones[i].checked = false;
            }
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

  compare(a, b) {
    a.text = a.text[0].toUpperCase() + a.text.substr(1).toLowerCase();
    b.text = b.text[0].toUpperCase() + b.text.substr(1).toLowerCase();
    if (a.text < b.text) {
      return -1;
    } else {
      return 1;
    }
  }

  applyFilters() {
    this.filtersService.specialities = this.specialities;
    this.filtersService.subspecialities = this.subspecialities;
    this.filtersService.obrassociales = this.obrassociales;
    this.filtersService.locations = this.ubicaciones;
    this.filtersService.distance = this.distancia;
    this.filtersService.score = this.puntuacion / 2;
    this.filtersService.stars = this.star;
    this.navCtrl.push(SearchPage);
  }

  onSearchSubEsp() {
    this.subspecialitiesAll = this.subspecialities;
    this.subspecialitiesAll = this.filterItems(this.searchKeyword);
  }

  filterItems(searchTerm){
    return this.subspecialitiesAll.filter((item) => {
      return item.text.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

}
