import { Component, OnInit } from '@angular/core';
import {CampaignService} from './../../services/campaign.service';
import {Campaign} from './../../models/campaign';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers:[CampaignService]
})
export class FooterComponent implements OnInit {
  
  highlightedCampaigns:Campaign[];
  photobaseUrl=environment.photo_base_url;
  currentUrl = location.href;
  currentYear = new Date().getFullYear();
  
  constructor(private campaignService:CampaignService) { }

  ngOnInit() {
    this.getHightedCampaigns();
  }
  getHightedCampaigns(){
    this.campaignService.getHighligthedCampaigns().subscribe(
      (data)=>{
        this.highlightedCampaigns=data;
        console.log(data);
      },
      (err)=>{
        console.log(err);
      }
    );
  }

}
