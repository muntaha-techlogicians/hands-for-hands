import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {CommonService} from './../../services/common.service';
import {Newsletter} from './../../models/newsletter';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css'],
  providers:[CommonService]
})
export class NewsletterComponent implements OnInit {
  
  formSubmitting = false;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
  }

  submitNewsletter(f: NgForm){
    this.formSubmitting = true;
    if(f.valid){
      const name = f.value.name;
      const email_address = f.value.email_address;

      this.commonService.submitNewsletter(name, email_address).subscribe(
        (data)=>{
          
          this.formSubmitting = false;
          f.reset();
          Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Email successfully added for newsletter!',
          });

        }
      )
    }

  }

}
