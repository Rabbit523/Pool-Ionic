/** For more information about google maps, refer to this URL: https://www.youtube.com/watch?v=lApggVS0icc */

import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  title: string = 'Pool Location';
  //lat: number; = 26.2022653;
  //lng: number; = 50.5371246;
  location:any;
  //source: any = [this.lat, this.lng];
  destination: any;// = [this.lat, this.lng];

  message: string = "Pool Booking: ";
  file: string = null;
  link: string;// = "https://www.google.com/maps/dir/" + this.lat + "," + this.lng + "/";
  subject: string = null;
  loading:any;
  constructor(public loadingCtrl:LoadingController, public navCtrl: NavController, public navParams: NavParams, private launchNavigator: LaunchNavigator,
    private socialSharing: SocialSharing) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      //console.log(this.navParams.get("location"));
      this.location = this.navParams.get("location");
      console.log(this.location);
      this.location.lat = Number(this.location.lat);
      this.location.long = Number(this.location.long);
      console.log(this.location);
      this.destination = [this.location.lat, this.location.long];
      this.link = "https://www.google.com/maps/dir/" + this.location.lat + "," + this.location.long + "/";
      console.log(this.link);
      this.loading.dismiss();
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  /** Navigate Location Function, this will be triggered when the user clicks on "Navigate" button to open the
   * google maps in his/her smartphone to navigate to the location
   * For more information about navigation, refer to this URL: https://ionicframework.com/docs/native/launch-navigator/
   */

  NavigateLocation(){
    /*let options: LaunchNavigatorOptions = {
      start: this.source
    };*/

    this.launchNavigator.navigate(this.destination).then(
      success => alert('Launched navigator'),
      error => alert('Error launching navigator: ' + error)
    );
  }

  /** Share Location Function, this will be triggered when the user click on "Share" button in order to display
   * all the application that can be shared with like "Whatsapp, Twitter, Facebook, ...etc"
   * For more information about navigation, refer to this URL: https://ionicframework.com/docs/native/social-sharing/ or
   * watch this video in youtube: https://www.youtube.com/watch?v=sU-JdM5h0-k
   */

  ShareLocation(){
    this.socialSharing.share(this.message, this.subject, this.file, this.link).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

}
