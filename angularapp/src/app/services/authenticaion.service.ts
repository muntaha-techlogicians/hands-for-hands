import { Injectable } from '@angular/core';
import {BaseService} from './base.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class AuthenticaionService extends BaseService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient) {
    super();
  }

  private url = 'rest-auth/';

  login(username: string, password: string) {
    return this.http.post<any>(this.API_BASE_URL + this.url+"custom-login/", { email: username, password: password })
        .map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.key) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', user.key);
                this.loggedIn.next(true);
            }
            return user;

        });
  }

  loginUsingGoogle(accessToken:string){
    return this.http.post<any>(this.API_BASE_URL + this.url+"google/", { access_token:accessToken})
        .map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.key) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', user.key);
                this.loggedIn.next(true);
            }
            return user;

        });
  }

  loginUsingFacebook(accessToken:string){
    return this.http.post<any>(this.API_BASE_URL + this.url+"facebook/", { access_token:accessToken})
        .map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.key) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', user.key);
                this.loggedIn.next(true);
            }
            return user;

        });
  }

  get isLoggedIn(){
    if(localStorage.getItem("currentUser")){
      this.loggedIn.next(true);
    }else{
      this.loggedIn.next(false);
    }
    return this.loggedIn.asObservable();
  }

  userLoggedIn():boolean{
    if(localStorage.getItem("currentUser")){
      return true;
    }else{
      return false;
    }
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      this.loggedIn.next(false);
  }

  resetPasswordRequest(email: string) {
    return this.http.post<any>(this.API_BASE_URL + "users/reset-password/", { email: email})
        .map(data => {
            return data;

        });
  }

  resetPasswordDone(uid: string, token: string, password1: string, password2: string) {
    return this.http.post<any>(this.API_BASE_URL + "users/reset-password-done/", { uid: uid, token: token, new_password1: password1, new_password2: password2})
        .map(data => {
            return data;

        });
  }

  resetPasswordConfirmation(uid: string, token: string) {
    return this.http.get<any>(this.API_BASE_URL + "users/reset-password-confirmation/" + uid + "/" + token)
        .map(data => {
            return data;

        });
  }

}
