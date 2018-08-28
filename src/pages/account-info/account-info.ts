import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController } from 'ionic-angular';
import { HttpProvider} from '../../providers/http/http';
import { Events } from 'ionic-angular';


@Component({
  selector: 'page-account-info',
  templateUrl: 'account-info.html',
})
export class AccountInfoPage {

  user:any = {};
  loading:any;
  constructor(public loadingCtrl:LoadingController, public events: Events, public alertCtrl: AlertController, public http: HttpProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.user = this.http.getCurrentUser();
    console.log(this.user);
    this.loading.dismiss();
  }

  updateUser(){
    let updateLoading = this.loadingCtrl.create();
    updateLoading.present();
    this.http.updateUser(this.user)
    .subscribe((data) => {
      console.log(data);
      updateLoading.dismiss();
      if(data = "updated"){
        this.events.publish('user:created', this.user , Date.now());
        let alert = this.alertCtrl.create({
          subTitle: 'User information has been updated',
          buttons: ['OK']
        });
        alert.present();
      }

    }, (err) => {
       console.log(err);
     });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountInfoPage');
  }

}
