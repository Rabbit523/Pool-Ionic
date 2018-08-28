import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as moment from 'moment';


/**
 * Generated class for the ReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-receipt',
  templateUrl: 'receipt.html',
})
export class ReceiptPage {

  receipt:any;
  payment:any;
  id:any;
  userDate:any;
  time:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.receipt = this.navParams.get("receipt");
    console.log("receipt",this.receipt);
    this.payment = this.navParams.get("payment");
    this.id = this.navParams.get("id");
    if(this.receipt.time == 'D'){
    this.time = "Morning";
    }
    else if (this.receipt.time == "N"){
    this.time = "Night";    
    }
    this.userDate = moment(this.receipt.date).format("dddd D MMM YYYY");
  }

  home(){
    this.navCtrl.setRoot(HomePage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiptPage');
  }

}
