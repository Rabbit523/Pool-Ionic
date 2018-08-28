import { SettingsPage } from './../pages/settings/settings';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,AlertController,MenuController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReservationsListPage } from './../pages/reservations-list/reservations-list';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { IntroPage } from './../pages/intro/intro';
import { HttpProvider} from '../providers/http/http';
import { Events } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { FcmProvider } from '../providers/fcm/fcm';

import { LanguagePage } from '../pages/language/language';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  textDir: string = "ltr";
  rootPage: any;
  loader: any;

  pages: Array<{title: string, component: any}>;

  currentUser:any = {};
  loading:any;
  constructor(public events: Events, public http: HttpProvider, public platform: Platform,
   public statusBar: StatusBar, public splashScreen: SplashScreen, public loadingCtrl: LoadingController,
    public storage: Storage, public alertCtrl: AlertController, public menuCtrl: MenuController,
    public fcm: FcmProvider, public translate: TranslateService) {
      translate.setDefaultLang('en');
      translate.use('en');

      this.initializeApp();
      
      events.subscribe('user:created', (user, time) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        console.log('Welcome', user, 'at', time);
        this.currentUser = user;
        console.log(this.currentUser);

      });
      
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }, 
      { title: 'Language', component: LanguagePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.statusBar.styleDefault();
      this.introChecker();
      this.getLocalUser();
      if(this.platform.is('android') || this.platform.is('ios')){
        this.fcm.getToken();
      }
	    setTimeout(()=>{
          this.splashScreen.hide();  
        },3000);
      this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
      {
        console.log("asdsad");
        this.textDir = event.lang == 'ar'? 'rtl' : 'ltr';
      });
    });
  }

  getLocalUser(){
    this.storage.get('cid').then((cid) => {
      console.log('Customer ID is:', cid);
      if(cid == "0" || cid == null){
        let user = {customer_id:0,first_name:"Guest"};
        this.http.setCurrentUser(user);
        this.events.publish('user:created', user , Date.now());
        this.loading.dismiss();    
      }
      else{
        this.http.getUser(cid)
        .subscribe((data) => {
          console.log(data);
          this.loading.dismiss();
          
          this.http.setCurrentUser(data);
          this.events.publish('user:created', data , Date.now());
          
        }, (err) => {
          console.log(err);
        });
      }
    });
  };

  introChecker(){
    this.storage.get('introShown').then((result) => {
        if(result){
          this.rootPage = HomePage;
          //this.nav.setRoot(HomePage);
        } else {
          this.storage.set('introShown', true);
          this.rootPage = IntroPage;
          //this.nav.setRoot(IntroPage);
        }
    });
  }

  goToMyReservations(){
    this.nav.setRoot(ReservationsListPage);
  }

  goToLanguage() {
    this.nav.setRoot(LanguagePage);
  }

  goToSettingsPage(){
    let user = this.http.getCurrentUser();
    if(user.customer_id == 0){
      this.nav.push(LoginPage,{},{animate: true, direction: 'forward'});
    }else{
      this.nav.setRoot(SettingsPage);
    }
  }

  goToHome(){
    this.nav.setRoot(HomePage);
  }

  logout(){
    this.http.logoutCurrentUser();
    let user = {customer_id:0,first_name:"Guest"};
    this.http.setCurrentUser(user);
    this.events.publish('user:created', user , Date.now());
    this.menuCtrl.close();
    let alert = this.alertCtrl.create({
      subTitle: 'Logged Out Successfully',
      buttons: ['OK']
    });
    alert.present();
    this.nav.setRoot(HomePage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
