import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController } from 'ionic-angular';
import { HttpProvider} from '../../providers/http/http';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-change-email',
  templateUrl: 'change-email.html',
})
export class ChangeEmailPage {

  user:any = {};
  currentUser:any = {};
  type='password';
  loading:any;
  emailError:boolean = false;
  constructor(public loadingCtrl:LoadingController, public events: Events, public alertCtrl: AlertController, public http: HttpProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.user.customer_id = this.http.getCurrentUser().customer_id;
    this.currentUser = this.http.getCurrentUser();
    this.loading.dismiss();
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.emailError = !re.test(String(email).toLowerCase()); 
    return re.test(String(email).toLowerCase());
  }


  showPsw(){
    if(this.type=='password'){
      this.type='text';
    }else this.type='password';
  }


  updateEmail(){
    if(this.validateEmail(this.user.email))
    {
      if(this.user.email != this.user.confirmEmail){
        let alert = this.alertCtrl.create({
          subTitle: "Email doesn't match confirm Email",
          buttons: ['OK']
        });
        alert.present();

      }else{
        let updateLoading = this.loadingCtrl.create();
        updateLoading.present();
        this.http.updateEmail(this.user)
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
          else if(data == "email updated"){
            let alert = this.alertCtrl.create({
              subTitle: 'Email has been updated',
              buttons: ['OK']
            });
            this.currentUser.email = this.user.email;
            this.user.password = "";
            alert.present();
          }

        }, (err) => {
          console.log(err);
        });
      }
    }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeEmailPage');
  }

}
