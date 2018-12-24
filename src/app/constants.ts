import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
    API_URL = 'https://todoreservas.com.ar:4443/api/';
    quantityOfResultsToShow = 10;
    constructor(
    ){
    }
}