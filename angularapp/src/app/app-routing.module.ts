import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {CampaignsComponent} from './pages/campaigns/campaigns.component'
import {CampaignDetailsComponent} from './pages/campaign-details/campaign-details.component'
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password.component';
import {ForgotPasswordConfirmationComponent} from './pages/forgot-password-confirmation/forgot-password-confirmation.component';
import {OnlyLoggedInUsersGuard} from "./guard";
import {BloodDonationComponent} from './pages/blood-donation/blood-donation.component';

const routes: Routes = [
   { path: '', component: HomeComponent},
   { path: 'blood-donation', component: BloodDonationComponent},
   { path: 'campaigns', component: CampaignsComponent},
   { path: 'campaigns/:categoryId', component: CampaignsComponent},
   { path: 'login', component: LoginComponent},
   { path: 'register', component: RegisterComponent},
   { path: 'forgot-password', component: ForgotPasswordComponent},
   { path: 'forgot-password-confirmation/:uid/:token', component: ForgotPasswordConfirmationComponent},
   { path: 'user-panel',loadChildren:'./modules/user/user.module#UserModule',canActivate: [OnlyLoggedInUsersGuard]},
   { path: ':slug', component: CampaignDetailsComponent},
];
@NgModule({
  imports: [
         RouterModule.forRoot(
             routes,
             {
                 // Tell the router to use the HashLocationStrategy.
                 useHash: false,
                 enableTracing: false
             }
         )
     ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
