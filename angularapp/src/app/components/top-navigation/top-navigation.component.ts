import { Component,OnInit, OnChanges,AfterViewChecked,AfterViewInit,HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {AuthenticaionService} from "../../services/authenticaion.service";
import { Observable } from 'rxjs/Observable';
import {Router,ActivatedRoute} from "@angular/router";
import * as $ from 'jquery';
@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css'],
  providers:[AuthenticaionService]
})
export class TopNavigationComponent implements OnInit,AfterViewChecked,AfterViewInit {
  isLoggedIn$:Observable<boolean>;
  returnUrl: string;
  language:string;
  constructor(private translate:TranslateService,private router: Router,private route: ActivatedRoute,private authenticationService:AuthenticaionService) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authenticationService.isLoggedIn;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.language = localStorage.getItem('language')|| 'en';

  }
  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
  ngAfterViewChecked(){
      //console.log("called after view checked");
      this.isLoggedIn$ = this.authenticationService.isLoggedIn;
   }
  ngAfterViewInit(){
    console.log("called init");
    //this.isLoggedIn$ = this.authenticationService.isLoggedIn;

  }

  openSideNav() {
    $('#mobile_menu').css({'left':'300px', 'transition':'.5s'});
  }

  toggleLanguage(event){
    if(event.target.checked){
      this.translate.use('bn');
      localStorage.setItem('language','bn');
    }else{
      this.translate.use('en');
      localStorage.setItem('language','en');
    }
  }
  menu:boolean = false;

  toggleMenu(){
    this.menu = !this.menu
  }
  clickedInside($event: Event){

    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers
    if($($event.target).hasClass('mobile-menu-item')){
      if(this.menu){
        $('#mobile_menu').css({'left':'0px', 'transition':'.5s'});
        $('#open_menu').attr('style','display:block !important');
        $('#close_menu').attr('style','display:none !important');
        this.menu = false;
      }
    } else {
      $('#mobile_menu').css({'left':'300px', 'transition':'.5s'});
      $('#open_menu').attr('style','display:none !important');
      $('#close_menu').attr('style','display:block !important');
    }

  }

  @HostListener('document:click', ['$event']) clickedOutside($event){
   if(this.menu){
      $('#mobile_menu').css({'left':'0px', 'transition':'.5s'});
      $('#open_menu').attr('style','display:block !important');
      $('#close_menu').attr('style','display:none !important');
      this.menu = false;
   }
  }
}
