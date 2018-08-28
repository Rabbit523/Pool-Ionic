import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TooltipsModule } from 'ionic-tooltips';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CallNumber } from '@ionic-native/call-number';
import { AgmCoreModule } from '@agm/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FCM } from '@ionic-native/fcm';
import { IonicImageViewerModule } from 'ionic-img-viewer';


import { MyApp } from './app.component';
import { IntroPage } from './../pages/intro/intro';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DetailsPage } from '../pages/details/details';
import { MapPage } from './../pages/map/map';
import { CheckoutPage } from './../pages/checkout/checkout';
import { ReservationsListPage } from './../pages/reservations-list/reservations-list';
import { ChangeEmailPage } from './../pages/change-email/change-email';
import { ChangePasswordPage } from './../pages/change-password/change-password';
import { AccountInfoPage } from './../pages/account-info/account-info';
import { SettingsPage } from './../pages/settings/settings';
import { LoginPage } from './../pages/login/login';
import { SignupPage } from './../pages/signup/signup';
import { ForgotPasswordPage } from './../pages/forgot-password/forgot-password';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NgCalendarModule } from 'ionic2-calendar';
import { HttpProvider } from '../providers/http/http';
import { RulesPage } from '../pages/rules/rules';
import { CompanyRulesPage } from '../pages/company-rules/company-rules';
import { FilterPage } from '../pages/filter/filter';
import { ReceiptPage } from  '../pages/receipt/receipt';
import { FcmProvider } from '../providers/fcm/fcm';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LanguageService } from '../providers/language.service';
import { LanguagePage } from '../pages/language/language';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

  // Initialize Firebase
 /* const firebase = {
    apiKey: "AIzaSyDC5yR2weepgngzw48f5F9Ft9LyX2TK2aY",
    authDomain: "rezzerve-e7575.firebaseapp.com",
    databaseURL: "https://rezzerve-e7575.firebaseio.com",
    projectId: "rezzerve-e7575",
    storageBucket: "rezzerve-e7575.appspot.com",
    messagingSenderId: "931957906327"
  }*/

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DetailsPage,
    MapPage,
    CheckoutPage,
    ReservationsListPage,
    SettingsPage,
    AccountInfoPage,
    ChangeEmailPage,
    ChangePasswordPage,
    IntroPage,
    LoginPage,
    SignupPage,
    ForgotPasswordPage,
    RulesPage,
    CompanyRulesPage,
    FilterPage,
    ReceiptPage,
    LanguagePage
  ],
  imports: [
    IonicImageViewerModule,
    NgCalendarModule,
    BrowserModule,
    TooltipsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDUFisWUQAyuy8FYcBQFMOeTHgiXIZcqic'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DetailsPage,
    MapPage,
    CheckoutPage,
    ReservationsListPage,
    SettingsPage,
    AccountInfoPage,
    ChangeEmailPage,
    ChangePasswordPage,
    IntroPage,
    LoginPage,
    SignupPage,
    ForgotPasswordPage,
    RulesPage,
    CompanyRulesPage,
    FilterPage,
    ReceiptPage,
    LanguagePage
    ],
  providers: [
    StatusBar,
    SplashScreen,
    CallNumber,
    LaunchNavigator,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpProvider,
    InAppBrowser,
    FCM,
    FcmProvider,
    LanguageService
  ]
})
export class AppModule {}
