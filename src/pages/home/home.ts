import { DetailsPage } from './../details/details';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { HttpProvider} from '../../providers/http/http';
import { DayViewComponent } from 'ionic2-calendar/dayview';
import { FilterPage } from '../filter/filter';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pools:any = [];
  boundary:any = {};
  noMore:boolean;
  currentDay:any;
  loading:any;
  current_lang: any;
  
  constructor(public loadingCtrl:LoadingController,public modalCtrl:ModalController, public http: HttpProvider, public navCtrl: NavController, public translate: TranslateService) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.currentDay = new Date().setHours(0,0,0,0);
    console.log("currentDay",this.currentDay);
    //number of pool per request
    this.boundary.limit = 5;
    this.boundary.offset = 0;
    this.noMore = false;
    this.getPools();

  }
  
  openFilter(){
    console.log("filter modal");
    let filterModal = this.modalCtrl.create(FilterPage);
    filterModal.onDidDismiss(data => {
      console.log("onDidDismiss");
      console.log("data",data);
      if(JSON.stringify(data) != '{}')
        this.pools = data;
    });
    filterModal.present();
  }

  getPools(){
    // for optimization bring partial of the data
    this.http.getPools(this.boundary)
    .subscribe((data) => {
      if(data < 1){
        console.log("No Data To Fetch")
        this.noMore = true; 
      }else{
        this.noMore = false;
      }

      this.pools = this.pools.concat(data);
      console.log("pools",this.pools);

      if (this.translate.currentLang == "en") {
        this.current_lang = "en";
      } else {
        this.current_lang = "ar";
      }
      
      //find offer
     /* for(let i = 0 ; i < this.pools.length ; i++){
          if(this.currentDay >= new Date(this.pools[i].offer_period_from).setHours(0,0,0,0)
           && this.currentDay <= new Date(this.pools[i].offer_period_to).setHours(0,0,0,0))
            this.pools[i].offer = true;
          else
            this.pools[i].offer = false;
      }*/   

      for(let i = 0 ; i < this.pools.length ; i++){
        this.pools[i].offer = false;
        this.pools[i].current_normal_price = this.pools[i].normal_price;
        this.pools[i].current_weekend_price = this.pools[i].weekend_price;
        for(let j = 0 ; j < this.pools[i].offers.length ; j++){
          if(this.currentDay >= new Date(this.pools[i].offers[j].offer_start_date).setHours(0,0,0,0)
            && this.currentDay <= new Date(this.pools[i].offers[j].offer_end_date).setHours(0,0,0,0)){
            this.pools[i].offer = true;
            this.pools[i].current_normal_price = this.pools[i].offers[j].offer_normal_price;
            this.pools[i].current_weekend_price = this.pools[i].offers[j].offer_weekend_price;
          }
        }
      }

      this.loading.dismiss();
    }, (err) => {
      console.log("err",err);
    });
    this.boundary.offset += this.boundary.limit;
  }

  fetchPools(infiniteScroll) {
    console.log('Begin async operation');
    this.getPools();
    setTimeout(() => {
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  goToDetailsPage(pid){
    //this.navCtrl.push(DetailsPage);
    this.navCtrl.push(DetailsPage,{pid},{animate: true, direction: 'forward'});
  }

}
