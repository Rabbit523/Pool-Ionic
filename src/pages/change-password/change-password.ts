import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController } from 'ionic-angular';
import { HttpProvider} from '../../providers/http/http';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  user:any ={};
  type1='password';
  type2='password';
  type3='password';
  loading:any;
  constructor(public loadingCtrl:LoadingController, public alertCtrl: AlertController, public http: HttpProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.user.customer_id = this.http.getCurrentUser().customer_id;
    this.loading.dismiss();
  }


  showPsw(index){
    if(index == 1){
      if(this.type1=='password'){
        this.type1='text';
      }else this.type1='password';
    }
    else if(index == 2){
      if(this.type2=='password'){
        this.type2='text';
      }else this.type2='password';
    }
    else if(index == 3){
      if(this.type3=='password'){
        this.type3='text';
      }else this.type3='password';
    }
  }

  updatePassword(){
    if(this.user.newPassword != this.user.confirmPassword){
      let alert = this.alertCtrl.create({
        subTitle: "password doesn't match confirm password",
        buttons: ['OK']
      });
      alert.present();

    }else{
      let updateLoading = this.loadingCtrl.create();
      updateLoading.present();
      this.user.confirmPassword = "";
      this.http.updatePassword(this.user)
      .subscribe((data) => {
        console.log(data);
        updateLoading.dismiss();
        if(data == "wrong password"){
          let alert = this.alertCtrl.create({
            subTitle: 'Wrong Password',
            buttons: ['OK']
          });
          alert.present();
        }
        else if(data == "password updated"){
          let alert = this.alertCtrl.create({
            subTitle: 'Password has been updated',
            buttons: ['OK']
          });
          this.user.currentPassword = "";
          this.user.newPassword = "";
          alert.present();
        }

      }, (err) => {
        console.log(err);
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

}
