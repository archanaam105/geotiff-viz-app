import { Component, OnInit } from '@angular/core';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { HistogramModalComponent } from '../histogram-modal/histogram-modal.component';
import { MapService } from '../map/map.service';
import { HistogramService } from './histogram.service';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent implements OnInit {

  showCreateButton: boolean = false;

  constructor(private histogramService : HistogramService,
    private matDialog : MatDialog,
    private mapService : MapService) { }

  ngOnInit(): void {
    this.mapService.histogram.subscribe(result => {
      this.plotHistogram(result);
    })
  }

  drawRectangle(){
    this.histogramService.geometry.next("start");
    this.showCreateButton = true;
  }

  getHistogram(){
    this.histogramService.createHistogram.next("create");
   
  }

  plotHistogram(result:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-component";
    dialogConfig.height = "500px";
    dialogConfig.width = "600px";
    dialogConfig.data = result;
    this.matDialog.open(HistogramModalComponent,dialogConfig);
  }


}
