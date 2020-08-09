import { Component, OnInit,OnChanges,EventEmitter, HostListener} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import {ActivatedRoute,Router, NavigationEnd} from "@angular/router";
import {CampaignService} from './../../services/campaign.service';
import {CampaignDetails} from './../../models/campaign-details';
import {CommentList} from '../../models/commentlist';
import {environment} from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import {NgForm} from '@angular/forms'
import {AuthenticaionService} from "./../../services/authenticaion.service";
import * as $ from 'jquery';
import Swal from 'sweetalert2';

import { Meta, Title, DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { changePageTitle, getUrlHost, getYoutubeVideoId, getBrowserInfo } from './../../utils';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css'],
  providers:[CampaignService]
})
export class CampaignDetailsComponent implements OnInit,OnChanges {
  isLoggedIn$:Observable<boolean>;
  photobaseUrl=environment.photo_base_url;
  slug:string;
  campaign:CampaignDetails;
  campaignID:number;
  coverImgUrl:string;
  featuredImgUrl:string;
  coverVdoUrl:string=null;
  isVdoAvailable=false;
  images:string[]=[];
  vedios:string[]=[];
  links:any[]=[];
  documents:string[]=[];
  comments:CommentList;
  limit = 5;
  offset = 0;
  currentPage = 1;
  commentPanelExpand = 0;
  breadcrumbBgStyle = {
    background: `linear-gradient( rgba(91, 139, 115, 0.9), rgba(39, 99, 69, 0.9)), url(${this.photobaseUrl}/${this.featuredImgUrl})`
  };
  pageTitle = 'Campaign Details';
  youtubeVideoUrl = '';
  private sub:any;
  videoPopupOpen = false;
  currentUrl = this.router.url;
  getUrlHost = getUrlHost;
  getYoutubeVideoId = getYoutubeVideoId;


  constructor(private route: ActivatedRoute,private router: Router,private campaignService:CampaignService,private authenticationService:AuthenticaionService,private meta: Meta, private titleService: Title, private sanitizer: DomSanitizer) {}
  ngOnInit() {
    $('body').on('click', '.campaign-tabs .tab > a', function(){
        let position_left = $(this).parent().position().left + ($(this).parent().outerWidth() / 2) - ($("#tri").outerWidth() / 2);
        $("#tri").css("left", position_left);
    });

    changePageTitle(this);
    this.sub= this.route.params.subscribe(
        params => {
            if(params['slug']){
              this.slug = params['slug'];
              this.getCampaignDetails();
              window.scrollTo(0, 0);
            }
        }
    );
    this.isLoggedIn$ = this.authenticationService.isLoggedIn;


    if(this.route.snapshot.queryParams['transaction_id'] && this.route.snapshot.queryParams['status'] == 'success'){
      Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Donation submission successful!',
      });
    } else if(this.route.snapshot.queryParams['status'] == 'failed'){
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Donation could not be submitted!',
      });
    }

    console.log(getBrowserInfo(window.navigator, window.screen));
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  getCampaignDetails(){
    const thisComponent = this;
    this.campaignService.getCampaignDetails(this.slug).subscribe(
      (data)=>{
        this.campaign=data;
        this.campaignID = data.id;
        this.featuredImgUrl = data.featured_image;
        this.pageTitle = data.title;
        changePageTitle(this);
        this.breadcrumbBgStyle = {
          background: `linear-gradient( rgba(91, 139, 115, 0.9), rgba(39, 99, 69, 0.9)), url(${this.photobaseUrl}/${this.featuredImgUrl})`
        };
        
        this.coverImgUrl = null;
        this.images = [];
        this.coverVdoUrl = null;
        this.isVdoAvailable = false;
        this.vedios = [];
        this.links = [];
        this.documents = [];

        this.campaign.documents.forEach(
          function(item){
            if(item.content_type === "cover_image"){
                thisComponent.coverImgUrl = item.content;
                thisComponent.images.push(item.content);
            }
            if(item.content_type === "cover_video_link"){
                //thisComponent.coverVdoUrl = "https://www.youtube.com/embed/"+item.content;
                thisComponent.coverVdoUrl = item.content;
                thisComponent.isVdoAvailable=true;
                //thisComponent.vedios.push("https://www.youtube.com/embed/"+item.content);
            }
            if(item.content_type==="image"){
              thisComponent.images.push(item.content)
            }
            if(item.content_type==="videolink"){
              //thisComponent.vedios.push("https://www.youtube.com/embed/"+item.content);
              thisComponent.vedios.push(item.content);
            }
            if(item.content_type=="link"){
              thisComponent.links.push(item);
            }
            if(item.content_type=="file"){
              thisComponent.documents.push(item.content);
            }

          }
        );
        this.getCommentsOfCampaign();
        this.addMeta(data);
      },(error)=>{
        //console.log('error here')
        this.router.navigate(['/campaigns'])
      }
    );

  }
  ngOnChanges(){
    console.log("herer");

  }
  getCommentsOfCampaign(){
    if(this.campaignID){
      this.campaignService.getComments(this.campaignID,this.limit,this.offset).subscribe(
      (data)=>{
        this.comments=data;
        this.comments.results.forEach(
          function(item){
            if(item.user.profile.image_url!=null){
              if(item.user.profile.image_url.startsWith("http://graph.facebook.com"))
              {
                item.user.profile.image_url=item.user.profile.image_url;
              }else if(item.user.profile.image_url.search("googleusercontent")!=-1){
                 item.user.profile.image_url=item.user.profile.image_url;
              }else{
                item.user.profile.image_url=environment.photo_base_url+"/"+item.user.profile.image_url;
              }
            }
          }
        );
      }
    )
    }

  }

  postComment(f: NgForm){
    if(f.valid){
      const reply = f.value.reply.replace(/^\s*$(?:\r\n?|\n)/gm,'');
      this.campaignService.postComment(this.campaignID,reply).subscribe(
        (data)=>{
          if(data.user.profile.image_url!=null){
            if(data.user.profile.image_url.startsWith("http://graph.facebook.com"))
            {
              data.user.profile.image_url=data.user.profile.image_url;
            }else if(data.user.profile.image_url.startsWith("https://lh3.googleusercontent.com")){
               data.user.profile.image_url=data.user.profile.image_url;
            }else{
              data.user.profile.image_url=environment.photo_base_url+"/"+data.user.profile.image_url;
            }
          }
          this.comments.results.unshift(data);
          f.reset();
        }
      )
    }

  }
  pageChanged(pageNumber){
    this.offset = (pageNumber * this.limit) - this.limit;
    this.currentPage = pageNumber;
    this.getCommentsOfCampaign();
  }
  addMeta(data){
    // <!-- Open Graph data -->
    //     <meta property="og:title" content="Vote For Utshab" />
    //     <meta property="og:type" content="website" />
    //     <meta property="og:url" content="http://coloringcontest.techlogicians.com/vote/MjE=" />
    //     <meta property="og:image" content="http://coloringcontest.techlogicians.com/artwork_files/5bd004fd4c05c_MorningRide.jpg" />
    //     <meta property="og:description" content="It's an contest for the students of the science & technology generation because the world is a blank canvas to our imagination!" />
    //     <meta property="og:site_name" content="Coloring Contest" />


    //      <meta itemprop="name" content="Vote For Utshab">
    //      <meta itemprop="description" content="It's an contest for the students of the science & technology generation because the world is a blank canvas to our imagination!">
    //      <meta itemprop="image" content="http://coloringcontest.techlogicians.com/artwork_files/5bd004fd4c05c_MorningRide.jpg">

    //      <!-- Twitter Card data -->
    //      <meta name="twitter:card" content="summary_large_image">
    //      <meta name="twitter:site" content="@coloringcontest">
    //      <meta name="twitter:creator" content="Utshab">
    //     <meta name="twitter:url" content="http://coloringcontest.techlogicians.com/vote/MjE=" />
    //      <meta name="twitter:title" content="Vote For Utshab">
    //      <meta name="twitter:description" content="It's an contest for the students of the science & technology generation because the world is a blank canvas to our imagination!">
    //      <meta name="twitter:image" content="http://coloringcontest.techlogicians.com/artwork_files/5bd004fd4c05c_MorningRide.jpg">
    data.documents.forEach( function(item){
                if(item.content_type === "featured_image"){
                    data.featured_image = item.content;
                }
              });
    this.meta.addTag({ property: 'og:title', content: data.title});
    this.meta.addTag({ property: 'og:type', content: 'website'});
    this.meta.addTag({ property: 'og:url', content: window.location.href});
    this.meta.addTag({ property: 'og:image', content: this.photobaseUrl+'/'+data.featured_image});
    this.meta.addTag({ property: 'og:description', content: data.story});
    this.meta.addTag({ property: 'og:site_name', content: 'Hands For Hand'});

    this.meta.addTag({ itemprop: 'name', content: data.title});
    this.meta.addTag({ itemprop: 'description', content: data.story});
    this.meta.addTag({ itemprop: 'image', content: this.photobaseUrl+'/'+data.featured_image});

    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image'});
    this.meta.addTag({ name: 'twitter:site', content: ''});
    this.meta.addTag({ name: 'twitter:creator', content: ''});
    this.meta.addTag({ name: 'twitter:url', content:  window.location.href});
    this.meta.addTag({ name: 'twitter:title', content: data.title});
    this.meta.addTag({ name: 'twitter:description', content: data.story});
    this.meta.addTag({ name: 'twitter:image', content: this.photobaseUrl+'/'+data.featured_image});
  }

  toggleCommentPanel(){
    if(this.commentPanelExpand){
      this.commentPanelExpand = 0
    } else {
      this.commentPanelExpand = 1;
    }
  }



  modalActions = new EventEmitter<string|MaterializeAction>();

  openModal(id) {
    this.youtubeVideoUrl = 'https://www.youtube.com/embed/'+id;
    document.querySelector('#youtubeVideoModal iframe').setAttribute('src',this.youtubeVideoUrl);
    this.modalActions.emit({action:"modal",params:['open']});
    this.videoPopupOpen = true;
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});    
    this.youtubeVideoUrl = '';
    document.querySelector('#youtubeVideoModal iframe').setAttribute('src',this.youtubeVideoUrl);
    this.videoPopupOpen = false;
  }
  // clickedInside($event: Event){
  //   this.openModal();
  // }
  @HostListener('document:click', ['$event']) clickedOutside($event){
    if($event.target.classList.contains('modal-overlay')){
      this.closeModal();
    }
  }
}
