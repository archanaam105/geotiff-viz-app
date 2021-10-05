import { Injectable } from '@angular/core';
import * as AWS from "aws-sdk";

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaService {
  private lambdaService: AWS.Lambda = new AWS.Lambda();
  region: string = "eu-west-2";
  identityPoolId: string = "eu-west-2:ecff2e4f-735b-4113-8e91-7884c77fccc5";
  constructor() { }

  private async runSetup() {
    AWS.config.region = this.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.identityPoolId
    });
    // console.log('CREATING LAMBDA SERVICE!');
    this.lambdaService = new AWS.Lambda(AWS.config);
    // console.log(this.lambdaService);
  }

  public async invokeLambda(functionName: string, functionArgs: any) {
    await this.runSetup();
    let request: AWS.Lambda.InvocationRequest = {
      FunctionName: functionName,
      Payload: JSON.stringify(functionArgs),
      InvocationType: 'RequestResponse'
    };
    return this.lambdaService.invoke(request).promise();

  }
}
