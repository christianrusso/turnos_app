import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
    //API_URL = 'https://todoreservas.com.ar:4443/api/';
    API_URL = 'http://192.168.0.11:5000/api/';
    quantityOfResultsToShow = 10;
    source = 3;
    baseUrlToSiteForShare = "http://todoreservas.com.ar/";
    clinicShareFolder = "info://info/";
    hairdressingShareFolder = "peluqueria";
    dniLength = 7;
    constructor(
    ){
    }
}