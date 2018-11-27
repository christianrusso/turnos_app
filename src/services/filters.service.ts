import { Injectable } from '@angular/core';

@Injectable()
export class FiltersService {
    specialities = [];
    subspecialities = [];
    stars = [
        {value:1, checked: false},
        {value:2, checked: false},
        {value:3, checked: false},
        {value:4, checked: false},
        {value:5, checked: false}
    ];
    distance = 0;
    locations = [];
    score = 0;
    obrassociales = [];
    category;

    constructor(
    ) {

    }



}