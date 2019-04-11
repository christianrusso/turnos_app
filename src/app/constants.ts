import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
    API_URL = 'https://todoreservas.com.ar:4443/api/';
    //API_URL = 'http://localhost:5000/api/';
    quantityOfResultsToShow = 10;
    source = 3;
    baseUrlToSiteForShare = "http://todoreservas.com.ar/";
    clinicShareFolder = "info://info/";
    hairdressingShareFolder = "peluqueria";
    dniLength = 7;
    constructor(
    ) {
    }
}

export const configs = {
    pages: [{
        name: 'Médicos',
        route: 'medicina',
        image: '../../assets/icon/medicos.png'
    }, {
        name: 'Estéticas',
        route: 'esteticas',
        image: '../../assets/icon/esteticas.png'
    }, {
        name: 'Peluquerías',
        route: 'peluquerias',
        image: '../../assets/icon/peluquerias.png'
    }, {
        name: 'Barberías',
        route: 'barberias',
        image: '../../assets/icon/barberias.png'
    }]
}