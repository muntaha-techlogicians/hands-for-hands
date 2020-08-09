import { Component,OnInit } from '@angular/core';
import {LoadingBarService} from '@ngx-loading-bar/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  loadingBarColor = '#42B77A';
  //constructor(public loader: LoadingBarService) {}

  constructor(private translate:TranslateService){
    this.translate.setDefaultLang('en');
    const language = localStorage.getItem('language');
    if(language){
      this.translate.use(language);
    }else{
      this.translate.use('en');
    }

  }

  ngOnInit(){
    console.log("app");
  }


}
