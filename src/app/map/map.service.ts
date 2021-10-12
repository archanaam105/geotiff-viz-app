import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MapService {

    map = new BehaviorSubject<any>(null);
    colorScale = new Subject();
    histogram = new Subject();


    constructor() { }

    updateMap(map: any) {
        this.map.next(map);
    }
}