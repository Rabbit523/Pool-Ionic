import { CheckoutPage } from './../checkout/checkout';
import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { MapPage } from './../map/map';
import { HttpProvider} from '../../providers/http/http';
import { DayViewComponent } from 'ionic2-calendar/dayview';
import { LoginPage } from '../login/login';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
// import { mobiscroll, MbscCalendarOptions, MbscFormOptions } from '@mobiscroll/angular';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  
  /** Price Details Variables */
  arabic: Date;
  rtl: Date;

  // arabicSettings: MbscCalendarOptions = {
  //   lang: 'ar'
  // };

  title: string = "Price Details";
  icon: string = "md-add-circle";
  showDetails: boolean = false;

  showTimingDetails: boolean = false;
  TimingIcon: string = "md-add-circle";

  eventClicked: boolean = false; //Whatever you want to initialise it as
  BookNowClicked: boolean = false;

  show = 0;
  icons: Array<any>;
  images:any = [];
  
  /*startTime = new Date('2018-03-14');
  endTime  = new Date('2018-03-14');

  eventSource = [{
    title: 'test',
    startTime: this.startTime,
    endTime: this.endTime,
    allDay: false
  }];*/

  viewTitle: string;
  selectedDay = new Date();
  calendar = {
    mode: 'month',
    currentDate: this.selectedDay
  }

  markDisabled = (date: Date) => {
    let current = new Date();
    current.setHours(0,0,0,0);

    return date < current;
};

  pid:any;
  pool:any = {};
  currentDay:any;
  currentMonth:any;
  buttons:any = {};
  orders:any = {};
  firstTime:number;
  selectedDate:any;
  loading:any;
  priceChangeFlag:boolean = false;
  constructor(public loadingCtrl:LoadingController, public alertCtrl: AlertController, public http: HttpProvider, public navCtrl: NavController, public navParams: NavParams, private call: CallNumber, public translate: TranslateService) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.firstTime = 0;
    this.buttons.active = false;// to solve prev month issues 
    this.currentDay = new Date().setHours(0,0,0,0);
    this.currentMonth = new Date().getMonth()+1;
    this.pid = this.navParams.get("pid");
    console.log("pid",this.pid);
    this.getPoolData(this.pid);
    this.getOrders(this.pid,new Date());
  }

  getOrders(pid,day){
    let ordersLoading = this.loadingCtrl.create();
    ordersLoading.present();

    this.buttons.active = false;
    let rules = {pid:pid,year:day.getFullYear(),month:(day.getMonth()+1),day:day.getDate()};
    return this.http.getOrders(rules)
    .subscribe((data) => {
      console.log("data",data)
      this.orders = data;
      if(this.firstTime == 0){
        this.onCurrentDateChanged(new Date());
        this.buttons.active = true;
        this.firstTime++;
      }else{
        this.onCurrentDateChanged(day);
        if(day < new Date().setHours(0,0,0,0))
        this.buttons.active = false;
        else
        this.buttons.active = true;
      }
      ordersLoading.dismiss();
    }, (err) => {
      console.log("err",err);
    });
  }

  getPoolData(pid){
    this.http.getPool(pid)
    .subscribe((data) => {
      this.pool = data;
      console.log("pool",this.pool);

      //to let price change method wait for data
      this.priceChangeFlag = true;

      /*if(this.currentDay >= new Date(this.pool.offer_period_from).setHours(0,0,0,0)
      && this.currentDay <= new Date(this.pool.offer_period_to).setHours(0,0,0,0))
        this.pool.offer = true;
      else
        this.pool.offer = false;*/
      
      this.pool.current_normal_price = this.pool.normal_price;
      this.pool.current_weekend_price = this.pool.weekend_price;
      this.pool.current_insurance = this.pool.insurance;
      this.pool.current_normal_deposit = this.pool.normal_deposit;
      this.pool.current_weekend_deposit = this.pool.weekend_deposit;
    
      for(let i = 0 ; i < this.pool.offers.length ; i++){
        if(this.currentDay >= new Date(this.pool.offers[i].offer_start_date).setHours(0,0,0,0)
          && this.currentDay <= new Date(this.pool.offers[i].offer_end_date).setHours(0,0,0,0)){
            this.pool.current_normal_price = this.pool.offers[i].offer_normal_price;
            this.pool.current_weekend_price = this.pool.offers[i].offer_weekend_price;
            this.pool.current_insurance = this.pool.offers[i].offer_insurance;
            this.pool.current_normal_deposit = this.pool.offers[i].offer_normal_deposit;
            this.pool.current_weekend_deposit = this.pool.offers[i].offer_weekend_deposit;
        }
      }

    //all day algorthim here
    let allDayDate:any = new Date();
    allDayDate = allDayDate.setHours(0,0,0,0);

    this.buttons.allDay = false;
    this.buttons.allDayDay = false;
    this.buttons.allDayNight = false;
    
    if(allDayDate >= new Date(this.pool.all_day_start_date).setHours(0,0,0,0)
    && allDayDate <= new Date(this.pool.all_day_end_date).setHours(0,0,0,0)){
      if(this.pool.all_day_day_night == "D" || this.pool.all_day_day_night == "d"){
        this.buttons.allDayDay = true;
        this.buttons.allDay = true;
      }
      else if(this.pool.all_day_day_night == "N" || this.pool.all_day_day_night == "n"){
        this.buttons.allDayNight = true;
        this.buttons.allDay = true;
      }
    }
      

      this.images.push(this.pool.pmain_image);
      for(let i = 0 ; i < this.pool.images.length ; i++)
      {
        this.images.push(this.pool.images[i].image);
      }
      console.log("images",this.images);
      this.loading.dismiss();
      }, (err) => {
      console.log("err",err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  TriggerCalendar(){
    this.BookNowClicked = true;
    console.log("TriggerCalendar");
  }

  onCurrentDateChanged(event){
    console.log('onCurrentDateChanged DetailsPage');

    this.selectedDate = event;
    console.log(this);
    
    console.log("event",event);
   
    console.log("calendar ",this.calendar);
    
    console.log("Month: ",event.getMonth()+1);

    console.log("Day: ",event.getDate());
    
    if(this.currentMonth != event.getMonth()+1){
      this.currentMonth = event.getMonth()+1;
      this.getOrders(this.pid,event);
    }

    // to solve issue if the prev month is gray the buttons will be disabled
    //using this it will be ativated again
    if(event.setHours(0,0,0,0) >= new Date().setHours(0,0,0,0))
    this.buttons.active = true;

    this.buttons.day = true;
    this.buttons.night = true;
    console.log("orders", this.orders);
    for(let i = 0 ; i < this.orders.length ; i++){
      //if(event.getDate() == new Date(this.orders[i].order_datetime).getDate()){
      if(event.getDate() == moment(this.orders[i].order_datetime).get("date")){
        console.log("dayNight: ",this.orders[i].day_night);
        if(this.orders[i].day_night == 'D' || this.orders[i].day_night == 'd'){
          this.buttons.day = false;
        }
        else if(this.orders[i].day_night == 'N' || this.orders[i].day_night == 'n'){
          this.buttons.night = false;
        }
      }
    }

    //all day algorthim here
    let allDayDate = this.selectedDate;
    allDayDate = allDayDate.setHours(0,0,0,0);

    this.buttons.allDay = false;
    this.buttons.allDayDay = false;
    this.buttons.allDayNight = false;
    
    if(allDayDate >= new Date(this.pool.all_day_start_date).setHours(0,0,0,0)
    && allDayDate <= new Date(this.pool.all_day_end_date).setHours(0,0,0,0)){
      if(this.pool.all_day_day_night == "D" || this.pool.all_day_day_night == "d"){
        this.buttons.allDayDay = true;
        this.buttons.allDay = true;
      }
      else if(this.pool.all_day_day_night == "N" || this.pool.all_day_day_night == "n"){
        this.buttons.allDayNight = true;
        this.buttons.allDay = true;
      }
    }
      


    //change price based on choosen date
    if(this.priceChangeFlag)
    {
      let datePrice = this.selectedDate;
      datePrice = datePrice.setHours(0,0,0,0);

      let normal = this.pool.current_normal_price;
      let weekend = this.pool.current_weekend_price;

      this.pool.current_normal_price = this.pool.normal_price;
      this.pool.current_weekend_price = this.pool.weekend_price;
      this.pool.current_insurance = this.pool.insurance;
      this.pool.current_normal_deposit = this.pool.normal_deposit;
      this.pool.current_weekend_deposit = this.pool.weekend_deposit;
    
      for(let i = 0 ; i < this.pool.offers.length ; i++){
        if(datePrice >= new Date(this.pool.offers[i].offer_start_date).setHours(0,0,0,0)
          && datePrice <= new Date(this.pool.offers[i].offer_end_date).setHours(0,0,0,0)){
            this.pool.current_normal_price = this.pool.offers[i].offer_normal_price;
            this.pool.current_weekend_price = this.pool.offers[i].offer_weekend_price;
            this.pool.current_insurance = this.pool.offers[i].offer_insurance;
            this.pool.current_normal_deposit = this.pool.offers[i].offer_normal_deposit;
            this.pool.current_weekend_deposit = this.pool.offers[i].offer_weekend_deposit;
        }
      }
      console.log("current normal",this.pool.current_normal_price);
      console.log("current weekend",this.pool.current_weekend_price);

      if(normal != this.pool.current_normal_price
         || weekend != this.pool.current_weekend_price){
          let priceAlert = this.alertCtrl.create({
            title:"Attention",
            subTitle: "Price changed on this date.",
            buttons: ['OK']
          });
          priceAlert.present();
      }

    }
  }

  onEventSelected(event){
    console.log('onEventSelected DetailsPage');
  }

  onTimeSelected($event){
    //console.log("onTimeSelected DetailsPage");

  }

  onViewTitleChanged(title){
    console.log("onViewTitleChanged DetailsPage");
    this.viewTitle = title;
  }

  /** Phone Number Calling Function, this is will takes the phoneNumber variable and call it using the native
   * dial-up application in the phone, it will only works in simulator or native devices.
   * I also changed the "tsconfig.json" file and replaced "target": "es5" to "target": "es6" in order to use "async"
   * for more information, you can refer to this video: https://www.youtube.com/watch?v=7kKcpgcSW60
   */
  async callNumber():Promise<any>{
    console.log("owner_mobile1: ", this.pool.owner_mobile1);
    try {
      this.call.callNumber(String(this.pool.owner_mobile1), true);
    }
    catch(e){
      console.error(e);
    }
  }

  /** Navigation to Map Page */
  goToMapPage(){
    let location:any = {lat: this.pool.latitude, long: this.pool.longitude};
    this.navCtrl.push(MapPage,{location},{animate: true, direction: 'forward'});
  }

  /** Navigation to Checkout Page */
  goToCheckoutPage(time){
    if(this.http.getCurrentUser().customer_id == 0){
      let alert = this.alertCtrl.create({
        subTitle: "Please Login First",
        buttons: ['OK']
      });
      alert.present();
      this.navCtrl.setRoot(LoginPage);
      
    }else{
      let checkoutLoading = this.loadingCtrl.create();
      checkoutLoading.present();
      let selected = {pool:this.pool,date:this.selectedDate,time:time};
      console.log("details selected",selected);

      //date format based on database don't change it
      let userDate = selected.date.getFullYear() + "-" + (selected.date.getMonth()+1) + "-" + selected.date.getDate();


      let tempOrder = {pid:this.pool.pool_id,date:userDate,time:time};
      console.log("tempOrder",tempOrder);
      this.http.checkTempOrder(tempOrder)
      .subscribe((data) => {
        console.log("data",data);
        checkoutLoading.dismiss();
        if(data ==  "temporary reserved")
        {
          let alert = this.alertCtrl.create({
            title:"Wait",
            subTitle: "There's someone trying to reserve it, please try again in 5 minutes ",
            buttons: ['OK']
          });
          alert.present();
        }
        else if(data == "not reserved"){
        this.navCtrl.push(CheckoutPage,{selected},{animate: true, direction: 'forward'});
        }
    
      }, (err) => {
        console.log("err",err);
      });
    }
  }



toggleDetails() {
  if (this.showDetails) {
      this.showDetails = false;
      this.icon = 'md-add-circle';
  } else {
      this.showDetails = true;
      this.icon = 'md-remove-circle';
  }
}

toggleTimingDetails(){
  if (this.showTimingDetails) {
    this.showTimingDetails = false;
    this.TimingIcon = 'md-add-circle';
  } else {
      this.showTimingDetails = true;
      this.TimingIcon = 'md-remove-circle';
  }
}


}
