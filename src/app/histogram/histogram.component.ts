import { Component, OnInit } from '@angular/core';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { HistogramModalComponent } from '../histogram-modal/histogram-modal.component';
import { HistogramService } from './histogram.service';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent implements OnInit {

  showCreateButton: boolean = false;

  constructor(private histogramService : HistogramService,
    public matDialog : MatDialog) { }

  ngOnInit(): void {
    
  }

  drawRectangle(){
    this.histogramService.rectangle.next("start");
    this.showCreateButton = true;
  }

  createHistogram(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    this.matDialog.open(HistogramModalComponent,dialogConfig);
  }

}
