import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import {Router} from '@angular/router';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import { UploadGeotiffService } from '../upload-geotiff/upload-geotiff.service';
import { MapService } from './map.service';
import * as d3 from 'd3';
import { EditVizService } from '../edit-viz/edit-viz.service';
import { HistogramService } from '../histogram/histogram.service';
const parseGeoraster = require("georaster");
const geoblaze = require('geoblaze');
import 'leaflet-draw';
import { Location } from '@angular/common';



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
  rasterGroup: any = L.layerGroup();
  histogramGroup: any = L.layerGroup();
  colorScale: any;
  drawOptions: any = {
    draw: false
  }
  rectangleDrawer: any;
  currentRoute:any = "";

  constructor(private uploadService: UploadGeotiffService,
    private mapService: MapService,
    private editVizService: EditVizService,
    private histogramService: HistogramService) { }


  ngOnInit(): void {
    this.uploadService.geotiffUrl.subscribe(url => {
      this.geotiffUrl = url;
      this.loadGeotiffAsLayer(this.geotiffUrl);
      this.map.on("click", (e: any) => {
        this.getElevation(e);
      });
    });
    this.editVizService.opacity.subscribe(opacity => {
      this.changeOpacity(opacity);
    })
    this.editVizService.scaleColor.subscribe(color => {
      this.changeColor(color);
      
    })
    this.histogramService.geometry.subscribe(geo => {
      this.map.removeEventListener("click");
      this.startDrawRectangle();
    })
    this.histogramService.createHistogram.subscribe(status => {
      this.getHistogram();
    })
  }


  private initMap(): void {
    this.map = L.map('map').setView([55.789, -1.729], 5);
    const tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    const drawControl = new L.Control.Draw(this.drawOptions);
    this.map.addControl(drawControl);
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
          this.georasterObj = raster;
          this.addGeorasterLayer(raster);
        });
      });
  }

  addGeorasterLayer(raster: any): void {
    //var scale = chroma.scale('Viridis').domain([raster.mins[0], raster.maxs[0]]);
    this.rasterGroup.clearLayers();
    this.histogramGroup.clearLayers();
    this.markerGroup.clearLayers(); 
    this.updateMapLayer(raster, 1);
    this.mapService.updateMap(this.map);
    this.mapService.colorScale.next(this.colorScale);
  }

  updateMapLayer(raster: any, opacity: any) {
    let scale = d3.scaleSequential([raster.mins[0], raster.maxs[0]], d3.interpolateViridis);
    this.colorScale = scale;
    var layer = new GeoRasterLayer({
      georaster: raster,
      opacity: opacity,
      resolution: 256,
      pixelValuesToColorFn: function (values): any {
        var pixel = values[0];
        if (pixel < 0) return;
        return scale(pixel);
      }
    });
    
    this.rasterGroup.addTo(this.map);
    layer.addTo(this.rasterGroup);
    this.map.fitBounds(layer.getBounds());
  }

  getElevation(event: any){
    console.log(event);
    this.markerGroup.addTo(this.map);
    const latlng = [event.latlng.lng, event.latlng.lat];
    const elevation = Math.round(geoblaze.identify(this.georasterObj, latlng) * 100) / 100;
    if (elevation > 0) {
      const marker = L.marker([latlng[1], latlng[0]], this.icon).addTo(this.markerGroup);
      marker.bindPopup("<b>Elevation:&nbsp;</b>" + elevation + "&nbsp;m").openPopup().on("popupclose", e => {
        this.markerGroup.removeLayer(e.target._leaflet_id);
      })
    }
  }

  changeOpacity(opacity: any) {
    var layer = this.rasterGroup.getLayers()[0];
    if (layer != undefined) {
      layer.setOpacity(opacity);
    }
  }

  changeColor(color: string) {
    let scale = d3.scaleSequential([this.georasterObj.mins[0], this.georasterObj.maxs[0]], d3.interpolateViridis);
    switch (color) {
      case "inferno":
        scale = d3.scaleSequential([this.georasterObj.mins[0], this.georasterObj.maxs[0]], d3.interpolateInferno);
        break
      case "turbo":
        scale = d3.scaleSequential([this.georasterObj.mins[0], this.georasterObj.maxs[0]], d3.interpolateTurbo);
        break
      case "magma":
        scale = d3.scaleSequential([this.georasterObj.mins[0], this.georasterObj.maxs[0]], d3.interpolateMagma);
        break
      case "plasma":
        scale = d3.scaleSequential([this.georasterObj.mins[0], this.georasterObj.maxs[0]], d3.interpolatePlasma);
        break
      case "cividis":
        scale = d3.scaleSequential([this.georasterObj.mins[0], this.georasterObj.maxs[0]], d3.interpolateCividis);
        break
      case "warm":
        scale = d3.scaleSequential([this.georasterObj.mins[0], this.georasterObj.maxs[0]], d3.interpolateMagma);
        break
      case "cool":
        scale = d3.scaleSequential([this.georasterObj.mins[0], this.georasterObj.maxs[0]], d3.interpolateCool);
        break

    }
    this.colorScale = scale;
    this.mapService.colorScale.next(this.colorScale);
    let layer = this.rasterGroup.getLayers()[0];
    var pixelValuesToColorFn = (values: any) => {
      var pixel = values[0];
      if (pixel < 0) return;
      return scale(pixel);
    }
    layer.updateColors(pixelValuesToColorFn);
  }


  startDrawRectangle() {
    this.histogramGroup.clearLayers();
    this.histogramGroup.addTo(this.map);
    this.rectangleDrawer = new L.Draw.Rectangle(this.map, this.drawOptions.draw.rectangle);
    this.rectangleDrawer.enable();
    this.map.on(L.Draw.Event.CREATED, (e: any) => {
      this.rectangleDrawer.disable();
      e.layer.addTo(this.histogramGroup);
    })
  }

  getHistogram() {
    const scaleType = 'ratio';
    const numClasses = 5;
    const classType = 'equal-interval';
    const layer = this.histogramGroup.getLayers()[0];
    console.log(layer);
    let result = geoblaze.histogram(this.georasterObj, layer.toGeoJSON(), { scaleType, numClasses, classType });
    console.log(result);
    let response = [];
    
    for (const [key, val] of Object.entries(result[0])) {
      response.push({ 'elevation': key, 'frequency': val as number });
    }
    console.log(response);
    this.mapService.histogram.next(response);
  }

}
