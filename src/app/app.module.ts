import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppRoutingModule } from './app-routing.module';
import { UploadGeotiffComponent } from './upload-geotiff/upload-geotiff.component';
import { HistogramComponent } from './histogram/histogram.component';
import { BackbuttonDirective } from './directives/backbutton.directive';
import { EditVizComponent } from './edit-viz/edit-viz.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { HistogramModalComponent } from './histogram-modal/histogram-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SidebarComponent,
    UploadGeotiffComponent,
    HistogramComponent,
    BackbuttonDirective,
    EditVizComponent,
    HistogramModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule

  ],
  providers: [],
  bootstrap: [AppComponent],
  //entryComponents: [HistogramModalComponent]
})
export class AppModule { }
