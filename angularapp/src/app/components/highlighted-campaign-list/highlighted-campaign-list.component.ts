import { Component, OnInit,ViewChild } from '@angular/core';
import {CampaignService} from './../../services/campaign.service';
import {Campaign} from './../../models/campaign';
import {environment} from '../../../environments/environment';
import * as $ from 'jquery';

@Component({
  selector: 'app-highlighted-campaign-list',
  templateUrl: './highlighted-campaign-list.component.html',
  styleUrls: ['./highlighted-campaign-list.component.css'],
  providers:[CampaignService]
})
export class HighlightedCampaignListComponent implements OnInit {
  @ViewChild('slickModal') slickModal;
  highlightedCampaigns:Campaign[];
  photobaseUrl=environment.photo_base_url;
  slideConfig = {
    "slidesToShow": 3, 
    "slidesToScroll": 3,
    prevArrow:$('.prev-campaign'),
    nextArrow: $('.next-campaign'),
    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: false
            }
        },
        {
            breakpoint: 800,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                autoplay: true,
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
  };
  constructor(private campaignService:CampaignService) {
    console.log($('.prev-campaign'))
  }

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
  afterChange(e) {
    console.log('afterChange');
  }

  slickNext(e){
    this.slickModal.slickNext();
  }
  slickPrev(e){
    this.slickModal.slickPrev();
  }
}
