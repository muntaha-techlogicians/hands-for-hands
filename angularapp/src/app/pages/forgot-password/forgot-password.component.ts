import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { changePageTitle } from './../../utils';
import { User } from '../../models/user';
import { AuthenticaionService } from '../../services/authenticaion.service';
import Swal from 'sweetalert2';
import {NgForm} from '@angular/forms';
import * as Materialize from 'materialize-css';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})


export class ForgotPasswordComponent implements OnInit {

  loading = false;
  model = new User;
  pageTitle = 'Forgot Password';
  successMessage = '';

  constructor(private titleService: Title, private authenticationService: AuthenticaionService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    
  	changePageTitle(this);
  }

  forgotPassword(f : NgForm){
  	this.loading = true;
  	this.authenticationService.resetPasswordRequest(this.model.email)
        .subscribe(
            data => {
                this.loading = false;
                this.successMessage = data.detail;
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
                f.reset();
                this.loading = false;
            });
  }

  resendMessage(){
  	this.successMessage = '';
  	setTimeout(function () { 
		    (window as any).Materialize.updateTextFields();
  	}, 10);

  }

}
