import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AccountInfoPage } from './../../pages/account-info/account-info';
import { ChangeEmailPage } from './../../pages/change-email/change-email';
import { ChangePasswordPage } from '../change-password/change-password';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  goToAccountInfoPage(){
    this.navCtrl.push(AccountInfoPage,{},{animate: true, direction: 'forward'});
  }

  goToChangeEmailPage(){
    this.navCtrl.push(ChangeEmailPage,{},{animate: true, direction: 'forward'});
  }

  goToChangePasswordPage(){
    this.navCtrl.push(ChangePasswordPage,{},{animate: true, direction: 'forward'});
  }

}
