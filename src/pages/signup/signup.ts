import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController, ModalController } from 'ionic-angular';
import { HttpProvider} from '../../providers/http/http';
import { Events } from 'ionic-angular';
import { CompanyRulesPage } from '../company-rules/company-rules';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  type='password';
  user:any = {};
  loading:any;
  emailError:boolean = false;
  constructor(public modalCtrl:ModalController, public loadingCtrl:LoadingController, public events: Events, public alertCtrl: AlertController, public http: HttpProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.emailError = !re.test(String(email).toLowerCase()); 
    return re.test(String(email).toLowerCase());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  createAccount(){
    if(this.validateEmail(this.user.email)){
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      console.log(this.user);
      this.http.signup(this.user)
      .subscribe((data) => {
        console.log(data);
        this.loading.dismiss();
        if(data == "used email"){
          this.user.password = "";
          let alert = this.alertCtrl.create({
            title:"Error",
            subTitle: 'The email is already in use, try to forget password.',
            buttons: ['OK']
          });
          alert.present();
        }
        else{
          let alert = this.alertCtrl.create({
            subTitle: 'Successfully Registered',
            buttons: ['OK']
          });
          alert.present();
          this.http.setCurrentUser(data);
          this.events.publish('user:created', data , Date.now());

          this.navHomePage();
        }
      
      }, (err) => {
        console.log(err);
      });
    }
  }

  rules(){
      let modal = this.modalCtrl.create(CompanyRulesPage);
      modal.present(); 
  }

  showPsw(){
    if(this.type=='password'){
      this.type='text'
    }else this.type='password'
  }

  navHomePage(){
    this.navCtrl.setRoot(HomePage);
  }

}