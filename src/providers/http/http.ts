import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import CryptoJS from 'crypto-js';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider {

  host:any;
  currentUser:any;
  constructor(public storage:Storage, public http: HttpClient) {
    console.log('Hello HttpProvider Provider');
    //this.host = "localhost";
    // live server
    //this.host = "rezzerve-tech.com";
    // test server
    this.host = "rezzerve-tech.com/test";
  }

  login(user){
    console.log("user",user);
     user.password = CryptoJS.SHA1(user.password).toString();
    //console.log(CryptoJS)
    //console.log(hash);
    user = JSON.stringify(user)
    return this.http.post("http://"+this.host+"/PoolsServer/api/userLogin.php",user);
  }

  signup(user){
    console.log("user",user);
     user.password = CryptoJS.SHA1(user.password).toString();
    //console.log(CryptoJS)
    //console.log(hash);
    user = JSON.stringify(user)
    return this.http.post("http://"+this.host+"/PoolsServer/api/userSignup.php",user);
  }

  setCurrentUser(user){
    this.currentUser = user;
    console.log("current user: ",this.currentUser);
    this.storage.set('cid', this.currentUser.customer_id).then((data)=>{
      /*this.storage.get('cid').then((data) => {
        console.log('Customer ID is:', data);
      });*/
    });
  }

  getCurrentUser(){
    return this.currentUser;
  }

  logoutCurrentUser(){
    this.currentUser = {};
    console.log("current user: ",this.currentUser);
  }

  getPool(pid){
    console.log("pid",pid);
    pid = JSON.stringify(pid)
    return this.http.post("http://"+this.host+"/PoolsServer/api/getPool.php",pid);
  }

  getPools(boundary){
    console.log("boundry",boundary);
    boundary = JSON.stringify(boundary)
    return this.http.post("http://"+this.host+"/PoolsServer/api/getPools.php",boundary);
  }

  getOrders(rules){
    console.log("rules http page",rules);
    rules = JSON.stringify(rules)
    return this.http.post("http://"+this.host+"/PoolsServer/api/getOrders.php",rules);
  }

  tempOrder(order){
    console.log("temp order http page",order);
    order = JSON.stringify(order);
    //console.log(order);
    return this.http.post("http://"+this.host+"/PoolsServer/api/tempOrder.php",order);
  }

  checkTempOrder(order){
    console.log("check temp order http page",order);
    order = JSON.stringify(order);
    //console.log(order);
    return this.http.post("http://"+this.host+"/PoolsServer/api/checkTempOrder.php",order);
  }

  removeTempOrder(orderId){
    console.log("check temp order http page",orderId);
    orderId = JSON.stringify(orderId);
    //console.log(orderId);
    return this.http.post("http://"+this.host+"/PoolsServer/api/removeTempOrder.php",orderId);
  }

  requestNewPassword(user){
    console.log("requestNewPassword http page",user);
    user = JSON.stringify(user);
    //console.log(user);
    return this.http.post("http://"+this.host+"/PoolsServer/api/changePassword.php",user);
  }

  updateUser(user){
    console.log("updateUser http page",user);
    user = JSON.stringify(user);
    //console.log(user);
    return this.http.post("http://"+this.host+"/PoolsServer/api/updateUser.php",user);
  }

  updateEmail(user){
    console.log("updateEmail http page",user);
    user.password = CryptoJS.SHA1(user.password).toString();
    user = JSON.stringify(user);
    //console.log(user);
    return this.http.post("http://"+this.host+"/PoolsServer/api/updateEmail.php",user);
  }

  updatePassword(user){
    console.log("updatePassword http page",user);
    user.currentPassword = CryptoJS.SHA1(user.currentPassword).toString();
    user.newPassword = CryptoJS.SHA1(user.newPassword).toString();
    user = JSON.stringify(user);
    //console.log(user);
    return this.http.post("http://"+this.host+"/PoolsServer/api/updatePassword.php",user);
  }

  getSystemInfo(){
    return this.http.get("http://"+this.host+"/PoolsServer/api/getSystemInfo.php");
  }
  
  getCities(){
    return this.http.get("http://"+this.host+"/PoolsServer/api/getCities.php");
  }

  applyFilter(filter){
    console.log("filter http page",filter);
    filter = JSON.stringify(filter);
    //console.log(user);
    return this.http.post("http://"+this.host+"/PoolsServer/api/applyFilter.php",filter);
  }

  getUser(cid){
    console.log("cid",cid);
    cid = JSON.stringify(cid)
    return this.http.post("http://"+this.host+"/PoolsServer/api/getUser.php",cid);
  }

  recordPayment(payment){
    console.log("payment",payment);
    return this.http.post("http://"+this.host+"/PoolsServer/api/recordPayment.php",payment);
  }

  order(orderRecord){
    console.log("orderRecord",orderRecord);
    orderRecord = JSON.stringify(orderRecord)
    return this.http.post("http://"+this.host+"/PoolsServer/api/order.php",orderRecord);
  }

  getReservations(cid){
    console.log("cid",cid);
    cid = JSON.stringify(cid)
    return this.http.post("http://"+this.host+"/PoolsServer/api/getReservations.php",cid);
  }
}
