import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, MenuController, LoadingController } from 'ionic-angular';
import { HttpProvider} from '../../providers/http/http';
import { Events } from 'ionic-angular';
import { SignupPage } from './../signup/signup';
import { ForgotPasswordPage } from './../forgot-password/forgot-password';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  type='password';
  user:any = {};
  loading:any;
  constructor(public loadingCtrl:LoadingController, public events: Events, public http: HttpProvider, public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, public menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    console.log(this.user);
    this.http.login(this.user)
    .subscribe((data) => {
      console.log(data);
      this.loading.dismiss();
      if(data == "invalid"){
        this.user.email = "";
        this.user.password = "";
        let alert = this.alertCtrl.create({
          title:"Error",
          subTitle: 'Wrong Email or Password',
          buttons: ['OK']
        });
        alert.present();
      }
      else{
        this.http.setCurrentUser(data);
        this.events.publish('user:created', data , Date.now());
        this.navHomePage();
      }
     
    }, (err) => {
       console.log(err);
     });
  }

  moveToForgotPasswordPage(){
   this.navCtrl.push(ForgotPasswordPage,{},{animate: true, direction: 'forward'});
  }

  moveToCreateAccountPage(){
    this.navCtrl.push(SignupPage,{},{animate: true, direction: 'forward'});
  }

  showPsw(){
    if(this.type=='password'){
      this.type='text';
    }else this.type='password';
  }

  navHomePage(){
    this.navCtrl.setRoot(HomePage);
  }

}
