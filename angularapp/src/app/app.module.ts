import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule }   from '@angular/forms';

import * as $ from 'jquery';
import { AppComponent } from './app.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { SliderHomeComponent } from './components/slider-home/slider-home.component';
import { LargeCategoryListComponent } from './components/large-category-list/large-category-list.component';
import { LargeCategoryItemComponent } from './components/large-category-item/large-category-item.component';
import { HighlightedCampaignListComponent } from './components/highlighted-campaign-list/highlighted-campaign-list.component';

import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import { AppRoutingModule } from './app-routing.module';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import { HomeComponent } from './pages/home/home.component';
import { CampaignItemComponent } from './components/campaign-item/campaign-item.component';
import { HomeStatComponent } from './components/home-stat/home-stat.component';
import { CampaignsComponent } from './pages/campaigns/campaigns.component';
import { CoverBannerComponent } from './components/cover-banner/cover-banner.component';
import { MediumCategoryListComponent } from './components/medium-category-list/medium-category-list.component';
import { MediumCategoryItemComponent } from './components/medium-category-item/medium-category-item.component';
import { CampaignsStatComponent } from './components/campaigns-stat/campaigns-stat.component';
import { CampaignDetailsComponent } from './pages/campaign-details/campaign-details.component';
import { CampaignDonationStatComponent } from './components/campaign-donation-stat/campaign-donation-stat.component';
import { CampaignCountdownComponent } from './components/campaign-countdown/campaign-countdown.component';
import { CampaignProgressBarComponent } from './components/campaign-progress-bar/campaign-progress-bar.component';
import { RecentDonationComponent } from './components/recent-donation/recent-donation.component';
import { TopDonationComponent } from './components/top-donation/top-donation.component';
import { SmallCategoryListComponent } from './components/small-category-list/small-category-list.component';
import { SmallCategoryItemComponent } from './components/small-category-item/small-category-item.component';
import { RelatedCampaignListComponent } from './components/related-campaign-list/related-campaign-list.component'
import { MaterializeModule } from "angular2-materialize";
import { TruncatePipe } from './pipes/truncate.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
// import {CountDown} from "ng2-date-countdown";
import { MomentModule } from 'ngx-moment';
import { SafePipe } from './pipes/safe.pipe';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { AuthenticaionService } from './services/authenticaion.service';
import { UserService } from './services/user.service';
import {httpLoaderFactory} from './services/httpLoaderFactory';


import {OnlyLoggedInUsersGuard} from "./guard";
import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
} from "angular5-social-login";
import { SlickModule } from 'ngx-slick';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { DonateDigitFormatPipe } from './pipes/donate-digit-format.pipe';
import { FragmentPolyfillModule } from "./modules/fragment-polyfill/fragment-polyfill.module";
import { FloorPipe } from './pipes/floor.pipe';
// import { NgScrollbarModule } from 'ngx-scrollbar';
import { MustMatchDirective } from './helpers/must-match.directive';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ForgotPasswordConfirmationComponent } from './pages/forgot-password-confirmation/forgot-password-confirmation.component';
import { BloodDonationComponent } from './pages/blood-donation/blood-donation.component';
import { BloodNeedDoctorComponent } from './components/blood-need-doctor/blood-need-doctor.component';
import { BloodDonationStatisticsComponent } from './components/blood-donation-statistics/blood-donation-statistics.component';


export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
	      provider: new FacebookLoginProvider("224923595254471")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
	        provider: new GoogleLoginProvider("46871854610-0914sfve3eodo7n1jir5vh8mfjvlnrhb.apps.googleusercontent.com")
        },
      ]
  );
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
    TopNavigationComponent,
    FooterComponent,
    SliderHomeComponent,
    LargeCategoryListComponent,
    LargeCategoryItemComponent,
    HighlightedCampaignListComponent,
    HomeComponent,
    CampaignItemComponent,
    HomeStatComponent,
    CampaignsComponent,
    CoverBannerComponent,
    MediumCategoryListComponent,
    MediumCategoryItemComponent,
    CampaignsStatComponent,
    CampaignDetailsComponent,
    CampaignDonationStatComponent,
    CampaignCountdownComponent,
    CampaignProgressBarComponent,
    RecentDonationComponent,
    TopDonationComponent,
    SmallCategoryListComponent,
    SmallCategoryItemComponent,
    RelatedCampaignListComponent,
    TruncatePipe,
    SafePipe,
    LoginComponent,
    RegisterComponent,
    DonateDigitFormatPipe,
    FloorPipe,
    MustMatchDirective,
    NewsletterComponent,
    CountdownComponent,
    CapitalizePipe,
    ForgotPasswordComponent,
    ForgotPasswordConfirmationComponent,
    BloodDonationComponent,
    BloodNeedDoctorComponent,
    BloodDonationStatisticsComponent
  ],
  imports: [
    BrowserModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    AppRoutingModule,
    LoadingBarModule.forRoot(),
    MaterializeModule,
    NgxPaginationModule,
    MomentModule,
    HttpClientModule,
    TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useFactory: httpLoaderFactory,
            deps: [HttpClient]
         }
    }),
    ShareButtonsModule.forRoot(),
    FormsModule,
    SocialLoginModule,
    SlickCarouselModule,
    FragmentPolyfillModule.forRoot({
        smooth: true
    }),
    // NgScrollbarModule
    //SlickModule.forRoot()

  ],
  providers: [
    AuthenticaionService,
    UserService,
    OnlyLoggedInUsersGuard,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
