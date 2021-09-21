import { Component } from '@angular/core';
import { UploadGeotiffService } from './upload-geotiff.service';
import { AwsLambdaService } from '../common/aws-lambda.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-upload-geotiff',
  templateUrl: './upload-geotiff.component.html',
  styleUrls: ['./upload-geotiff.component.css']
})
export class UploadGeotiffComponent {

  selectedFiles?: FileList;
  progressInfo: number = -1;
  totalProgress: number = 100;
  clicked: boolean = false;
  showLoadFileBtn: boolean = false;
  tiffUrl: string = "../../assets/test/cog_4326.tif";
  bucketName: string = "geotiff-files-bucket";
  lambdaName: string = "create-cogeotiffs";

  constructor(private uploadService: UploadGeotiffService,
    private lambdaService: AwsLambdaService) { }

  selectFiles(event: any){
    this.selectedFiles = event.target.files;
  }

  async upload(idx: number, file: File, progress:number){
    if (file) {
      const response = await this.uploadService.uploadFile(file);
      this.progressInfo = Math.min(this.progressInfo + progress,100); 
      console.log(response);
    }
  }

  async uploadFiles(){
    if (this.selectedFiles) {
      var progress = Math.round(this.totalProgress/this.selectedFiles.length)+1;
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const res = await this.upload(i, this.selectedFiles[i], progress);
      }
      console.log("test")
      this.showLoadFileBtn = true;
      this.invokeLambda();
    }
  }

  invokeLambda() {
    console.log("invoke lambda")
     const request = {
         bucket : this.bucketName
     }
     this.lambdaService.invokeLambda(this.lambdaName, request).then(res=>{
       if(res.StatusCode===200){  
           this.tiffUrl = JSON.parse(JSON.stringify(res.Payload)).replaceAll('"',"");
           console.log(this.tiffUrl);
       }else{
         // throw error
       }
     });
  }

  loadGeotiff(){
     this.uploadService.geotiffUrl.next(this.tiffUrl);
  }

}
