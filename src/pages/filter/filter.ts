import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';

/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {

  knobValues: any = {
    upper:100,
    lower:50
  };
  waterType:any = "all";
  cities:any = [];
  loading:any;
  pools:any = {};
  closeByHardware:boolean = true;
  constructor(public loadingCtrl:LoadingController, public http: HttpProvider,
     public view:ViewController, public navCtrl: NavController,
      public navParams: NavParams) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.getCities();
  }

  updateCities(index){
    if( index == 0 && this.cities[0].checked == true){
      for(let i = 1 ; i < this.cities.length ; i++)
        this.cities[i].checked = false;
    }
    else if(index != 0 && this.cities[index].checked == true){
      this.cities[0].checked = false;
    }else if(index == 0 && this.cities[0].checked == false){
      let trigger:boolean = false;
      for(let i = 1 ; i < this.cities.length ; i++){
        if(this.cities[i].checked == true){
          trigger = true;
        }
      }
      if(trigger == false)
        this.cities[0].checked = true;
    }

    console.log("cities",this.cities);
  }

  getCities(){
    this.http.getCities()
    .subscribe((data) => {
      console.log("data",data);
      this.cities = data;
      this.loading.dismiss();
    }, (err) => {
      console.log("err",err);
    });
  }

  apply(){
    let filter = {priceRange:this.knobValues,cities:this.cities,waterType:this.waterType};
    
    let applyLoading = this.loadingCtrl.create();
    applyLoading.present();
    
    this.http.applyFilter(filter)
    .subscribe((data) => {
    
      console.log("data",data);
      this.pools = data;
      applyLoading.dismiss();

      this.closeFilterView();

    }, (err) => {
      console.log("err",err);
    });
  }


  closeFilterView(){
    this.closeByHardware = false;
    this.view.dismiss(this.pools);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
  }

  ionViewWillLeave(){
    console.log("ionViewWillLeave FilterPage");
  
    console.log("closeByHardware",this.closeByHardware);
    if(this.closeByHardware){
      this.closeFilterView();
    }
  }
  
}
