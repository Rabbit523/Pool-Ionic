import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  constructor(public http: HttpClient, public fcm:FCM) {
    console.log('Hello FcmProvider Provider');
  }

  //this.fcm.subscribeToTopic('all');
  
  getToken(){
    
    this.fcm.getToken().then(token=>{
      console.log("token",token);
    })

    this.fcm.onNotification().subscribe(data=>{
      if(data.wasTapped){
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };
    })
    
    this.fcm.onTokenRefresh().subscribe(token=>{
      console.log("token",token);
    });

  }
  
}
