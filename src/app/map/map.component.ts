import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  private map: any;

  constructor() { }


  private initMap(): void{
    this.map = L.map('map').setView([55.789,-1.729], 5);
    const tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void { 
     this.initMap();
  }

}
