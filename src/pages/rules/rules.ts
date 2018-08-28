import { Component } from '@angular/core';
import { NavController, NavParams,ViewController, LoadingController } from 'ionic-angular';

/**
 * Generated class for the RulesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-rules',
  templateUrl: 'rules.html',
})
export class RulesPage {

  rules:any;
  loading:any;
  constructor(public loadingCtrl:LoadingController,public view:ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.rules = this.navParams.get("rules");
    console.log(this.rules);
    this.loading.dismiss();
  }

  closeRulesView(){
    this.view.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RulesPage');
  }

}
