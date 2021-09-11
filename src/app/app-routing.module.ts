import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadGeotiffComponent } from './upload-geotiff/upload-geotiff.component';

const routes : Routes = [
  {path:'uploadGeotiff', component: UploadGeotiffComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
