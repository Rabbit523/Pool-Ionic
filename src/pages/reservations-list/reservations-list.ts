import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CallNumber } from '@ionic-native/call-number';
import * as moment from 'moment';
import { HttpProvider } from '../../providers/http/http';

@Component({
  selector: 'page-reservations-list',
  templateUrl: 'reservations-list.html',
})
export class ReservationsListPage {

  
  loading:any;  
  reservations:any;
  constructor(public loadingCtrl:LoadingController, public navCtrl: NavController, public navParams: NavParams,
     public socialSharing:SocialSharing, public call:CallNumber, public http:HttpProvider) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      this.getReservation();
    }

  getReservation(){
    let cid = this.http.getCurrentUser().customer_id;
    
    this.http.getReservations(cid)
    .subscribe((data) => {
      console.log(data);
      this.reservations = data;

      this.improveReservationsVisual();
      this.loading.dismiss();

    } , (err) => {
      console.log(err);
    })
  }

  improveReservationsVisual(){
    for(let i = 0 ; i < this.reservations.length ; i++){
      this.reservations[i].order_datetime = moment(this.reservations[i].order_datetime).format("dddd D MMM YYYY");
        if(this.reservations[i].day_night == "D"){
          this.reservations[i].day_night = "Morning";
        }
        else if(this.reservations[i].day_night == "N"){
          this.reservations[i].day_night = "Night";
        }
        this.reservations[i].balance = this.reservations[i].pool_price - this.reservations[i].amount;
      }

  }
  
  async callNumber(phone):Promise<any>{
    try {
      this.call.callNumber(String(phone), true);
    }
    catch(e){
      console.error(e);
    }
  }

  shareLocation(lat,lng){
    //let title: string = 'Pool Location';
   // let lat: number = 26.2022653;
   // let lng: number = 50.5371246;
    //source: any = [this.lat, this.lng];
    //let destination: any = [lat,lng];

    let message: string = "Pool Booking: ";
    let file: string = null;
    let link: string = "https://www.google.com/maps/dir/" + lat + "," + lng + "/";
    let subject: string = null;

    this.socialSharing.share(message, subject, file, link).then((data) => {
      // Success!
      console.log(data);
    }).catch((err) => {
      // Error!
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservationsListPage');
  }

}
