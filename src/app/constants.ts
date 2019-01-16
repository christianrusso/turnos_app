import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
    //API_URL = 'https://todoreservas.com.ar:4443/api/';
    API_URL = 'http://localhost:5000/api/';
    quantityOfResultsToShow = 10;
    source = 3;
    constructor(
    ){
    }
}