import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,LoadingController } from 'ionic-angular';
import { HttpProvider} from '../../providers/http/http';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  user:any = {};
  constructor(public loadingCtrl: LoadingController,public alertCtrl: AlertController, public http: HttpProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  resetPassword(){
    let loading = this.loadingCtrl.create({});
    loading.present();

    this.http.requestNewPassword(this.user)
    .subscribe((data) => {
      console.log(data);
      loading.dismiss();
      if(data == "password reset"){
        let alert = this.alertCtrl.create({
          subTitle: "Your password has been reset, please check your phone for an sms",
          buttons: ['OK']
        });
        alert.present();
        this.navCtrl.setRoot(LoginPage);
      }
      else if(data == "no user"){
        let alert = this.alertCtrl.create({
          title:"Wrong",
          subTitle: "There's no existing user with the following email and mobile number",
          buttons: ['OK']
        });
        alert.present();
      }

    }, (err) => {
      console.log(err);
    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

}
