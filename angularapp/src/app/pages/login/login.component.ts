import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";
import Swal from 'sweetalert2';
import { User } from '../../models/user';
import { AuthenticaionService } from '../../services/authenticaion.service';
import {
    AuthService,
    FacebookLoginProvider,
    GoogleLoginProvider
} from 'angular5-social-login';
import { Title } from '@angular/platform-browser';
import { changePageTitle, getErrorMessageHTML } from './../../utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted = false;

  loading = false;
  model = new User();
  returnUrl: string;
  pageTitle = 'Login';
  params = {};

  constructor(private socialAuthService: AuthService,private router: Router,private route: ActivatedRoute,private authenticationService: AuthenticaionService, private titleService: Title) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl']? decodeURIComponent(this.route.snapshot.queryParams['returnUrl']) : '/';
    console.log('returnurl',this.route.snapshot.queryParams)
    changePageTitle(this);

    if(this.route.snapshot.queryParams['openModal']){
      this.params['openModal'] = true;
    }
  }

  onSubmit() { this.submitted = true; }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.email, this.model.password)
        .subscribe(
            data => {
              console.log('returnurl after',this.returnUrl);
              if(!this.route.snapshot.queryParams['openModal']){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Login successful!',
                });
              }
              this.router.navigate([this.returnUrl], {
                queryParams: this.params
              });
            },
            error => {
                console.log('not authenticated', error);
                
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  html: getErrorMessageHTML(error),
                });
                this.loading = false;
            });
  }

  public socialSignIn(socialPlatform : string) {
    let socialPlatformProvider;
    if(socialPlatform == "facebook"){
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }else if(socialPlatform == "google"){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(userData);
        if (socialPlatform == "google") {
          this.authenticationService.loginUsingGoogle(userData.token).subscribe(
            (data)=> {
              this.router.navigate([this.returnUrl]);
            },
            error=> {

              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: getErrorMessageHTML(error),
              });

              console.log('not authenticated')
              this.loading = false;
            }
          );
        } else if (socialPlatform == "facebook") {
          this.authenticationService.loginUsingFacebook(userData.token).subscribe(
            (data)=> {
              this.router.navigate([this.returnUrl]);
            },
            error=> {

              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: getErrorMessageHTML(error),
              });

              console.log('not authenticated')
              this.loading = false;
            }
          );
        }
      }
    );
  }

  log(error){
    console.log('sad')
    console.log(error)
  }

}
