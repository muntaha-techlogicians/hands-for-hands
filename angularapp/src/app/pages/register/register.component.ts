import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular5-social-login';
import {AuthenticaionService} from '../../services/authenticaion.service';
import {Title} from '@angular/platform-browser';
import {changePageTitle} from './../../utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  loading = false;
  model = new User;
  pageTitle = 'Registration';

  constructor(private socialAuthService: AuthService, private router: Router, private userService: UserService, private authenticationService: AuthenticaionService, private titleService: Title) {
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    changePageTitle(this);
  }

  register() {
    this.loading = true;
    this.userService.creat(this.model)
      .subscribe(
        data => {
          // set success message and pass true paramater to persist the message after redirecting to the login page
          // this.alertService.success('Registration successful', true);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Registration successful!',
          });
          this.router.navigate(['/login']);
        },
        error => {
          let errors = error.error;
          let keys = Object.keys(errors);
          let errorMessage = '<ul style="color:red">';
          for (const key of keys) {
            let errMsgs = errors[key];
            for (const msg of errMsgs) {
              console.log(msg);
              if (msg != '') {
                errorMessage += '<li>' + msg + '<li/>';
              }
            }
          }
          errorMessage += "</ul>";
          console.log(errorMessage)

          if(error.status == 500){
            errorMessage = 'Server Error'
          } else if(error.status == 404){
            errorMessage = 'Not Found'
          }
          // this.alertService.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: errorMessage,
          });
          this.loading = false;
        });
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(userData);
        if (socialPlatform == "google") {
          this.authenticationService.loginUsingGoogle(userData.token).subscribe(
            (data) => {
              this.router.navigate(['/']);
            },
            error => {
              console.log('not authenticated')
              this.loading = false;
            }
          );
        } else if (socialPlatform == "facebook") {
          this.authenticationService.loginUsingFacebook(userData.token).subscribe(
            (data) => {
              this.router.navigate(['/']);
            },
            error => {
              console.log('not authenticated')
              this.loading = false;
            }
          );
        }
      }
    );
  }

}
