import { Component, OnInit,ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { Meta, Title } from '@angular/platform-browser';
import { changePageTitle } from './../../utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  @ViewChild('slickModal') slickModal;
  slideConfig = {
    "slidesToShow": 3, 
    "slidesToScroll": 3,
    prevArrow:$('.prev-people'),
    nextArrow: $('.next-people'),
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
    ],
  };
  pageTitle = '';
  events = [
    {
      title : 'Be active at home',
      description : `Doing any activity around the home is better than none at all`,
      time : '',
      location : '',
      href : 'https://www.who.int/bangladesh/emergencies/coronavirus-disease-(covid-19)-update/be-active-at-home',
      image : 'https://www.who.int/images/default-source/searo---images/countries/bangladesh/infographics/stay-active-at-home/en/1.tmb-340v.png?sfvrsn=c4973678_1'
    },
    {
      title : 'COVID-19 Pandemic Response',
      description : `The coronavirus COVID-19 pandemic is the defining global health crisis of our time and the greatest challenge we have faced since World War Two. Since its emergence in Asia late last year, the virus has spread to every continent except Antarctica. Cases are rising daily in Africa the Americas, and Europe.`,
      time : '',
      location : '',
      href : 'https://www.bd.undp.org/content/bangladesh/en/home/coronavirus.html',
      image : 'https://www.undp.org/content/dam/undp/images/covid19-hero-background.jpg'
    },
    {
      title : 'Bangladesh: Low COVID-19 testing rate raises concerns',
      description : `Concerns continue to grow in Bangladesh over the country's limited coronavirus testing capacity, with experts urging the government to focus on increasing daily tests to ensure a successful fight against the pandemic.`,
      time : '',
      location : '',
      href : 'https://www.aa.com.tr/en/asia-pacific/bangladesh-low-covid-19-testing-rate-raises-concerns/1810132',
      image : 'https://cdnuploads.aa.com.tr/uploads/Contents/2020/04/19/thumbs_b_c_3361ec8b46838aed1701a06fbd7725a0.jpg?v=003441'
    },
    {
      title : 'Hasina urges Bangladeshis to offer Eid prayers at home as COVID-19 cases surge',
      description : `Prime Minister Sheikh Hasina has urged Muslims in Bangladesh to offer the prayers for Eid-ul-Fitr at home instead of congregations in mosques as the number of known coronavirus infections continued to jump.`,
      time : '',
      location : '',
      href : 'https://bdnews24.com/bangladesh/2020/04/20/hasina-urges-bangladeshis-to-offer-eid-prayers-at-home-as-covid-19-cases-surge',
      image : 'https://d30fl32nd2baj9.cloudfront.net/media/2020/04/03/coronavirus-jummah-prayer-030420-13.jpg/ALTERNATES/w640/coronavirus-jummah-prayer-030420-13.jpg'
    },
  ];
  constructor(private meta: Meta, private titleService: Title) {
    this.meta.addTag({ name: 'description', content: 'CHARITY IS THE BEST FORM OF PRAYER'});
    this.meta.addTag({ name: 'keywords', content: 'Donation,Charity,help'});
  }

  ngOnInit() {
    changePageTitle(this);
  }
  afterChange(e) {
    console.log('afterChange');
  }
  init(e) {
    setTimeout(function(){
      let maxHeight = 0;
      console.log(e);
      for(let i = 0; i < e.slick.$slidesCache.length; i++){
        let dom = e.slick.$slidesCache[i];
        let height = Number(getComputedStyle(dom.querySelector('.card')).height.replace('px',''));

        if(height > maxHeight){
          maxHeight = height;
        }
      };

      for(let i = 0; i < e.slick.$slidesCache.length; i++){
        let dom = e.slick.$slidesCache[i];
        dom.querySelector('.card').style.height = maxHeight + 'px';
      };
    },500);
  }

  slickNext(e){
    this.slickModal.slickNext();
  }
  slickPrev(e){
    this.slickModal.slickPrev();
  }


}
