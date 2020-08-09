import { Component, OnInit,Input,OnChanges } from '@angular/core';
import {CategorylistService} from '../../services/categorylist.service';
import {Category} from '../../models/category';
import {environment} from '../../../environments/environment';
@Component({
  selector: 'app-medium-category-list',
  templateUrl: './medium-category-list.component.html',
  styleUrls: ['./medium-category-list.component.css'],
  providers:[CategorylistService]
})
export class MediumCategoryListComponent implements OnInit,OnChanges {

  @Input("selectedCategory") selectedCategory;
  categories:Category[];
  categoryName="Categories";
  categoryDesc="People are expecting donations from different sectors.";
  photobaseUrl=environment.photo_base_url;

  constructor(private categoryListService:CategorylistService) { }

  ngOnInit() {
    //this.getCategories();
  }
  ngOnChanges(){
    this.getCategories();
    if(this.selectedCategory){
      this.getCategoryDetails();
    }

  }
  getCategories(){
    this.categoryListService.getCategoryList().subscribe(
      (data)=>{
        this.categories=data;
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  getCategoryDetails(){
    this.categoryListService.getCategoryDetails(this.selectedCategory).subscribe(
      (data)=>{
          this.categoryName=data.name;
          this.categoryDesc=data.descriptions;
      }
    );
  }

}
