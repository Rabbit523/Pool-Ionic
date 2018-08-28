import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,LoadingController } from 'ionic-angular';
import { HttpProvider} from '../../providers/http/http';

/**
 * Generated class for the CompanyRulesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-company-rules',
  templateUrl: 'company-rules.html',
})
export class CompanyRulesPage {

  system:any = {};
  loading:any;
  constructor(public loadingCtrl: LoadingController,public http: HttpProvider, public navCtrl: NavController, public navParams: NavParams,public view:ViewController) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.getSystemInfo();
  }

  getSystemInfo(){
    this.http.getSystemInfo()
    .subscribe((data) => {
      console.log(data);
      this.system = data;
      this.loading.dismiss();
      
    }, (err) => {
       console.log(err);
     });
  }

  closeCompanyRulesView(){
    this.view.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanyRulesPage');
  }

}
