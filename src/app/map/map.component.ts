import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import { UploadGeotiffService } from '../upload-geotiff/upload-geotiff.service';
import * as chroma from 'chroma-js';
const parseGeoraster = require("georaster");
const geoblaze = require('geoblaze')
const proj4 = require("proj4-fully-loaded");


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  private map: any;
  geotiffUrl: String = "";
  georasterObj: any;
  icon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
      iconUrl: '../../assets/images/marker-icon.png',
      shadowUrl: '../../assets/images/marker-shadow.png'
    })
  };
  markerGroup: any = L.layerGroup();

  constructor(private uploadService: UploadGeotiffService) { }


  ngOnInit(): void {
    this.uploadService.geotiffUrl.subscribe(url => {
      this.geotiffUrl = url;
      this.loadGeotiffAsLayer(this.geotiffUrl);
      this.map.on("click", (e: any) => {
        this.getElevation(e);
      });
    });
  }


  private initMap(): void {
    this.map = L.map('map').setView([55.789, -1.729], 5);
    const tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  loadGeotiffAsLayer(url: any): void {
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        parseGeoraster(arrayBuffer).then((raster: any) => {
           this.addGeorasterLayer(raster);
        });
      });
  }

  addGeorasterLayer(raster:any):void{
    this.georasterObj = raster;
    var scale = chroma.scale('Viridis').domain([0, raster.maxs[0]]);
    var layer = new GeoRasterLayer({
      georaster: raster,
      opacity: 0.9,
      resolution: 256,
      pixelValuesToColorFn: function (values): any {
        var pixel = values[0];
        if (pixel < 0) return;
        return scale(pixel);
      }
    });
    layer.addTo(this.map);
    this.map.fitBounds(layer.getBounds());
  }

  getElevation(event: any): void {
    this.markerGroup.addTo(this.map);
    const latlng = [event.latlng.lng, event.latlng.lat];
    const elevation = Math.round(geoblaze.identify(this.georasterObj, latlng) * 100) / 100;
    if(elevation>0){
      const marker = L.marker([latlng[1], latlng[0]], this.icon).addTo(this.markerGroup);
      marker.bindPopup("<b>Elevation:&nbsp;</b>" + elevation+ "&nbsp;m").openPopup().on("popupclose", e => {
        this.markerGroup.removeLayer(e.target._leaflet_id);
      })
    }
  }
}
