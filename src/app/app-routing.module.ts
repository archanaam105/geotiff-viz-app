import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditVizComponent } from './edit-viz/edit-viz.component';
import { HistogramComponent } from './histogram/histogram.component';
import { UploadGeotiffComponent } from './upload-geotiff/upload-geotiff.component';

const routes: Routes = [
  { path: 'uploadGeotiff', component: UploadGeotiffComponent },
  { path: 'histogram', component: HistogramComponent },
  { path: 'editViz', component:EditVizComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
