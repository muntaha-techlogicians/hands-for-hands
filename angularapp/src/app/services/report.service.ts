import { Injectable } from '@angular/core';
import {BaseService} from './base.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {Observable} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {HomeStat} from '../models/homestat';
import {CampaignStat} from '../models/campaign-stat';
import {BloodPlasmaDonorGroupStat} from '../models/blood-plasma-donor-group-stat';
import {BloodDonationHomeStat} from '../models/blood-donation-home-stat';
import 'rxjs/add/operator/map';
@Injectable()
export class ReportService extends BaseService {

  private url = "report/";

  constructor(private http:HttpClient) {
    super()
  }

  public getHomeStat():Observable<HomeStat>{
    return this.http.get<HomeStat>(this.API_BASE_URL+this.url+"home/");
  }

  public getCategoryStat(id):Observable<HomeStat>{
    return this.http.get<HomeStat>(this.API_BASE_URL+this.url+"category/"+id+"/");
  }

  public getDonationStat(id):Observable<CampaignStat>{
    return this.http.get<CampaignStat>(this.API_BASE_URL+this.url+"campaign/"+id+"/");
  }

  public getBloodDonorHomeStat():Observable<BloodDonationHomeStat>{
    return this.http.get<BloodDonationHomeStat>(this.API_BASE_URL+this.url+"blood-donor-home/");
  }

  public getPlasmaDonorGroupStat():Observable<BloodPlasmaDonorGroupStat>{
    return this.http.get<BloodPlasmaDonorGroupStat>(this.API_BASE_URL+this.url+"plasma-donor-group-report/");
  }

  public getBloodDonorGroupStat():Observable<BloodPlasmaDonorGroupStat>{
    return this.http.get<BloodPlasmaDonorGroupStat>(this.API_BASE_URL+this.url+"blood-donor-group-report/");
  }

}
