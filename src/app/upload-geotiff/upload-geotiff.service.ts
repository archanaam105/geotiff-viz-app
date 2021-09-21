import { Injectable } from "@angular/core";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UploadGeotiffService {

    bucketName: string = "geotiff-files-bucket";
    bucketRegion: string = "eu-west-2";
    identityPoolId: string = "eu-west-2:ecff2e4f-735b-4113-8e91-7884c77fccc5";
    folder: string = "upload/";
    geotiffUrl = new Subject<String>();

    uploadFile(file: File){
        AWS.config.region = this.bucketRegion;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: this.identityPoolId
        });
        const params = {
            Bucket: this.bucketName,
            Key: this.folder + file.name,
            Body: file
        }
        const bucket = new S3();
        return bucket.upload(params).promise();

    }

}