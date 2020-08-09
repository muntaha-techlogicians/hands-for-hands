import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Newsletter} from "../models/newsletter";
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class CommonService extends BaseService{

  constructor(private http:HttpClient) {
  	super();
  }  

  submitNewsletter(name, email_address):Observable<Newsletter>{
    const httpOptions = {
        headers: new HttpHeaders({
        	
        })
    };
    return this.http.post<Newsletter>(this.API_BASE_URL+"newsletter/",{name:name, email_address:email_address},httpOptions);
  }
}
