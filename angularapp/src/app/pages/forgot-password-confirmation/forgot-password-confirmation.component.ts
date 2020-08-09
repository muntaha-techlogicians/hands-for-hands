import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router, NavigationEnd} from "@angular/router";
import { Title } from '@angular/platform-browser';
import { changePageTitle } from './../../utils';
import { User } from '../../models/user';
import { AuthenticaionService } from '../../services/authenticaion.service';
import Swal from 'sweetalert2';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-forgot-password-confirmation',
  templateUrl: './forgot-password-confirmation.component.html',
  styleUrls: ['./forgot-password-confirmation.component.css']
})
export class ForgotPasswordConfirmationComponent implements OnInit {

  uid:string;
  token:string;
  private sub:any;
  loading = false;
  model = new User;
  pageTitle = 'Forgot Password Confirmation';
  successMessage = '';
  valid_uid_token = false;

  constructor(private route: ActivatedRoute, private router: Router, private titleService: Title,  private authenticationService: AuthenticaionService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    
  	changePageTitle(this);

  	this.sub= this.route.params.subscribe(
  	    params => {
  	    	if(params['uid'] && params['token']){
  	          this.uid = params['uid'];
  	          this.token = params['token'];

  	          this.resetPasswordConfirmation();
	  	    }
  	    }
  	);
  }

  resetPassword(f : NgForm){
  	this.loading = true;
  	this.authenticationService.resetPasswordDone(this.uid, this.token, this.model.password1,this.model.password2)
        .subscribe(
            data => {
                 Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: data.detail,
                });
                this.router.navigate(['/login']);
            },
            error => {
                let errors = error.error;
                let keys = Object.keys(errors);
                let errorMessage = '<ul style="color:red">';
                for(const key of keys){
                  let errMsgs = errors[key];
                  for(const msg of errMsgs){
                    console.log(msg);
                    if(msg!=''){
                      errorMessage += '<li>'+msg+'<li/>';
                    }
                  }
                }
                errorMessage+="</ul>";
                console.log(errorMessage)

                // this.alertService.error(error);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  html: errorMessage,
                });
                f.reset();
            }).add(() => {
      	  		    this.loading = false;
      			});
  }

  resetPasswordConfirmation(){
  	this.loading = true;
  	this.authenticationService.resetPasswordConfirmation(this.uid, this.token)
  		.subscribe(
  		    data => {
  		    	console.log(data)
  		        this.valid_uid_token = true;
  		    },
  		    error => {
  		        console.log(error)
  		    }).add(() => {
    	  		    this.loading = false;
    			});
  }

}
