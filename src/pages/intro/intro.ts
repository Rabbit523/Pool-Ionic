import { Component, ViewChild, trigger, transition, style, state, animate, keyframes, ChangeDetectorRef } from '@angular/core';
import { NavController, Slides, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { HttpProvider} from '../../providers/http/http';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
  animations: [

    trigger('bounce', [
      state('*', style({
        transform: 'translateX(0)'
      })),
      transition('* => rightSwipe', animate('700ms ease-out', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(-65px)', offset: .3}),
        style({transform: 'translateX(0)', offset: 1})
      ]))),
      transition('* => leftSwipe', animate('700ms ease-out', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(65px)', offset: .3}),
        style({transform: 'translateX(0)', offset: 1})
      ])))
    ])
  ]
})
export class IntroPage {
  @ViewChild(Slides) slides: Slides;
  
  skipMsg:string = "Skip";
  state:string = 'x';

  //loading:any;
  constructor(public storage:Storage,public loadingCtrl:LoadingController, public events: Events, public http: HttpProvider, public navCtrl: NavController, private changeDetectorRef: ChangeDetectorRef) {
    //this.loading = this.loadingCtrl.create();
    //this.loading.present();
    //this.getLocalUser();
  }

  /*getLocalUser(){
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
  };*/

  skip() {
    this.navCtrl.setRoot(HomePage);
  }

  slideChanged() {
    if (this.slides.isEnd())
      this.skipMsg = "Alright, I got it";
  }

  slideMoved() {
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex())
      this.state = 'rightSwipe';
    else
      this.state = 'leftSwipe';
  }

  animationDone() {
    this.state = 'x';
    this.changeDetectorRef.detectChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

}
