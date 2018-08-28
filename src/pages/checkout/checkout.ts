import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { HttpProvider} from '../../providers/http/http';
import { RulesPage } from '../rules/rules';
import { CompanyRulesPage } from '../company-rules/company-rules';
import { ReceiptPage } from '../receipt/receipt';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { HomePage } from '../home/home';


/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  slides:any = [];
  selected:any = {};
  userDate:any;
  paymentInfo:any = {};
  timer:any;
  orderId:any;
  loading:any;
  allDay:any;
  constructor(public alertCtrl:AlertController, private iab: InAppBrowser, public modalCtrl: ModalController, public http: HttpProvider, public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({});
    this.loading.present();
    
    this.selected = this.navParams.get("selected");
    console.log("checkout selected");
    console.log(this.selected);

    this.allDay = false;
    if(this.selected.date >= new Date(this.selected.pool.all_day_start_date).setHours(0,0,0,0)
    && this.selected.date <= new Date(this.selected.pool.all_day_end_date).setHours(0,0,0,0)){
      if(this.selected.time == "D" || this.selected.time  == "d"){
        this.allDay = true;
      }
      else if(this.selected.time  == "N" || this.selected.time  == "n"){
        this.allDay = true;
      }
    }
    console.log("allDay",this.allDay);

    //date format based on database don't change it
    this.userDate = this.selected.date.getFullYear() + "-" + (this.selected.date.getMonth()+1) + "-" + this.selected.date.getDate();

    this.slides.push(this.selected.pool.pmain_image);
    for(let i = 0 ; i < this.selected.pool.images.length ; i++)
    {
      this.slides.push(this.selected.pool.images[i].image);
    }

    console.log(this.slides);
    this.calculatePaymentInfo();

    this.tempOrder();

    this.timer = setTimeout(() => {this.throwUserOut()}, 1000*60*5);
  }

  throwUserOut(){
    this.http.removeTempOrder(this.orderId)
    .subscribe((data) => {
      console.log(data)      
    }, (err) => {
      console.log(err);
    });
    
    console.log("throw user out");
    this.navCtrl.pop();
  }

  tempOrder(){
    console.log(this.http.getCurrentUser());
    let order = {cid:this.http.getCurrentUser().customer_id,pid:this.selected.pool.pool_id,
      orderTime:this.userDate,dayNight:this.selected.time,paymentAmount:this.paymentInfo.deposit};

      console.log("temp order");
      console.log(order);
    
    this.http.tempOrder(order)
    .subscribe((data) => {
      console.log("tempOrder",data);
      this.orderId = data;
      this.loading.dismiss();

      
    }, (err) => {
      console.log(err);
    });
  }

  calculatePaymentInfo(){
    //console.log(this.selected.date.getDay() == 5);
    if( (this.selected.date.getDay() == 4 && this.selected.time  == "N") ||
    this.selected.date.getDay() == 5 || (this.selected.date.getDay() == 6 && this.selected.time  == "D")){
      //weekend
      //console.log("weekends");
      /*if(this.selected.pool.offer == true){
        this.paymentInfo.price = this.selected.pool.offer_weekend_price;
      }else{
        this.paymentInfo.price = this.selected.pool.weekend_price;
      }*/

      this.paymentInfo.price = this.selected.pool.current_weekend_price
      this.paymentInfo.deposit = this.selected.pool.current_weekend_deposit;
      this.paymentInfo.insurance = this.selected.pool.current_insurance;

    }else{
      //weekdays
      //console.log("weekdays");
     /* if(this.selected.pool.offer == true){
        this.paymentInfo.price = this.selected.pool.offer_normal_price;
      }else{
        this.paymentInfo.price = this.selected.pool.normal_price;
      }*/

      this.paymentInfo.price = this.selected.pool.current_normal_price
      this.paymentInfo.deposit = this.selected.pool.current_normal_deposit;
      this.paymentInfo.insurance = this.selected.pool.current_insurance;

    }
    console.log("Payment Info",this.paymentInfo);
  }

  rules(modalNumber){
    if(modalNumber == 1){
      console.log(this.selected.pool.rules);
      let modal = this.modalCtrl.create(RulesPage,{rules: this.selected.pool.rules});
      modal.present();
    }
    else if(modalNumber == 0){
      let modal = this.modalCtrl.create(CompanyRulesPage);
      modal.present();
    }
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

  ionViewWillLeave(){
    console.log("ionViewWillLeave CheckoutPage");

    this.http.removeTempOrder(this.orderId)
      .subscribe((data) => {
        console.log(data)      
      }, (err) => {
        console.log(err);
      });
    }
  

  ngOnDestroy() {
    console.log("ngOnDestroy");
  }

  pay(){

    const options:InAppBrowserOptions = {
      location:"no",
      zoom:"no",
      toolbar:"no"
    };

    let paytabInformation:any = {customer:this.http.getCurrentUser(),payment:this.paymentInfo,pool:this.selected.pool.pool_name};
    console.log("paytabInformation",paytabInformation);
    paytabInformation = JSON.stringify(paytabInformation);
   
    //test server
    let url:string = "http://rezzerve-tech.com/test/PoolsServer/api/create_pay_page.php?paytabInformation="+paytabInformation;

    //let url:string = "http://rezzerve-tech.com/PoolsServer/api/create_pay_page.php?paytabInformation="+paytabInformation;
    
    //for stupid ios it need to be encoded
   url = encodeURI(url);
   const browser = this.iab.create(url,'_blank',options);    

    browser.on("loadstart").subscribe(event => {
      console.log("loadstart",event);
    });

    browser.on("loadstop").subscribe(event => {
      console.log("loadstop",event);
     
     //test server
      if(event.url == "http://rezzerve-tech.com/test/PoolsServer/api/verify_payment.php"){
     // if(event.url == "http://rezzerve-tech.com/PoolsServer/api/verify_payment.php"){
       browser.executeScript(
       //   { code: "document.body.innerHTML" }
        { code : "document.getElementById('result').value"}
        ).then(respond => {
          console.log("respond",respond);

          this.http.recordPayment(respond[0])
          .subscribe((data) => {
            console.log("payment_id",data);

          let orderRecord = {customer_id:this.http.getCurrentUser().customer_id, 
            paymentRecord:data, pool_id:this.selected.pool.pool_id,
            pool_price:this.paymentInfo.price, pool_insurance:this.paymentInfo.insurance,
            orderTime:this.userDate, dayNight:this.selected.time};

          this.http.order(orderRecord)
          .subscribe((data) => {
            let paid:any = data;

            if(paid.respond == "paid"){
              this.navCtrl.setRoot(ReceiptPage,{receipt:this.selected,payment:this.paymentInfo,id:paid.id},{animate: true, direction: 'forward'});
            }
            else if(paid.respond == "not paid"){
              let notPaidAlert =  this.alertCtrl.create({
                subTitle: "Transaction failed",
                buttons: ['OK']
              });
              notPaidAlert.present();
              this.navCtrl.setRoot(HomePage);
            }
          },(err) => {
            console.log(err);
          })
            

          }, (err) =>{
            console.log(err);
          })

          browser.close();
        })
     }

    });

    browser.on("loaderror").subscribe(event => {
      console.log("loaderror",event);
    });
    
    browser.on("exit").subscribe(event => {
      console.log("exit",event);
    });
  
  }

}
