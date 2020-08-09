import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {User} from '../models/user';
import {BaseService} from './base.service';
import {UserDetails} from "../models/user-details";
import {Donate} from "../models/donate";
import {UserDonationStat} from "../models/user-donation-stat";
import {UserProfile} from "../models/user-profile";

@Injectable()
export class UserService extends BaseService {

  constructor(private http: HttpClient) {
    super()
  }

  creat(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };


    return this.http.post(this.API_BASE_URL + 'rest-auth/registration/', user, httpOptions);
    // return this.http.post(this.API_BASE_URL + 'rest-auth/registration/', user);
  }

  update(firstName, lastName) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    return this.http.post<UserDetails>(this.API_BASE_URL + "users/update/", {
      firstname: firstName,
      lastname: lastName
    }, httpOptions);
  }

  imageUpload(file) {
    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type':  'multipart/form-data;boundary=BoUnDaRyStRiNg',
        //'Media_Type':  'multipart/form-data',
        //'Content-Disposition': 'attachment;filename='+file.name,
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<UserProfile>(this.API_BASE_URL + "users/upload-profile-image/", formData, httpOptions);
  }

  details() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    return this.http.get<UserDetails>(this.API_BASE_URL + "users/details/", httpOptions);

  }

  donations() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    return this.http.get<Donate[]>(this.API_BASE_URL + "users/donations/", httpOptions);

  }

  stat() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    return this.http.get<UserDonationStat>(this.API_BASE_URL + "users/donations/report/", httpOptions);
  }

  changeVisibility(is_private) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    return this.http.post<boolean>(this.API_BASE_URL + "users/change-visibility/", {is_private: is_private}, httpOptions);
  }

  changePassword(old_password, new_password, confirm_password) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    let payloads = {
      old_password: old_password,
      new_password1: new_password,
      new_password2: confirm_password
    };

    return this.http.post<boolean>(this.API_BASE_URL + "users/change-password/", payloads, httpOptions);
  }

  changePhoneNumber(phone_number) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    let payloads = {
      phone_number: phone_number
    };

    return this.http.post<boolean>(this.API_BASE_URL + "users/change-phone-number/", payloads, httpOptions);
  }

  showPhoneNumber(phone_number) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    let payloads = {
      show_mobile_number: phone_number
    };

    return this.http.post<boolean>(this.API_BASE_URL + "users/show-mobile-number/", payloads, httpOptions);
  }

  setPassword(new_password, confirm_password) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    let payloads = {
      new_password1: new_password,
      new_password2: confirm_password
    };
    return this.http.post<boolean>(this.API_BASE_URL + "users/set-password/", payloads, httpOptions);
  }

  changeBloodGroup(group) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    let payloads = {
      blood_group: group
    };
    return this.http.post<boolean>(this.API_BASE_URL + "users/change-blood-group/", payloads, httpOptions);
  }

  bePlasmaDonor(plasma_donor, covid_recover_date) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    let payloads = {
      plasma_donor: plasma_donor,
      covid_recover_date: covid_recover_date,
    };
    return this.http.post<boolean>(this.API_BASE_URL + "users/be-plasma-donor/", payloads, httpOptions);
  }

  beBloodDonor(blood_donor) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.getItem("currentUser")
      })
    };
    let payloads = {
      blood_donor: blood_donor
    };
    return this.http.post<boolean>(this.API_BASE_URL + "users/be-blood-donor/", payloads, httpOptions);
  }


}
