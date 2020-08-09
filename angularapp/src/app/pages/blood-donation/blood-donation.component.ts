import { Component, OnInit, EventEmitter, HostListener } from '@angular/core';
import { getYoutubeVideoId } from './../../utils';
import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-blood-donation',
  templateUrl: './blood-donation.component.html',
  styleUrls: ['./blood-donation.component.css']
})
export class BloodDonationComponent implements OnInit {

  youtubeVideoUrl = 'https://www.youtube.com/watch?v=sPOz_4f9Qw4';
  videoPopupOpen = false;

  getYoutubeVideoId = getYoutubeVideoId;

  constructor() { }


  ngOnInit() {
  }

  modalActions = new EventEmitter<string|MaterializeAction>();
  openModal(id) {
    document.querySelector('#youtubeVideoModal iframe').setAttribute('src','https://www.youtube.com/embed/'+id);
    this.modalActions.emit({action:"modal",params:['open']});
    this.videoPopupOpen = true;
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
    document.querySelector('#youtubeVideoModal iframe').setAttribute('src','');
    this.videoPopupOpen = false;
  }
  @HostListener('document:click', ['$event']) clickedOutside($event){
    if($event.target.classList.contains('modal-overlay')){
      this.closeModal();
    }
  }
}
