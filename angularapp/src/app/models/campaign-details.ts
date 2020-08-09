import {Category} from './category';
import {Tag} from './tags';

import {CampaignComment} from './campaign-comment';
import {CampaignDonate} from './campaign-donate';
import {Document} from './document';
import {Package} from './package';

export interface CampaignDetails{
  id:number;
  title: string;
  story:string;
  amount:string;
  start_date:string;
  end_date:string;
  status:number;
  publish_date:string;
  category:Category;
  documents:Document[];
  campaign_donates:CampaignDonate[];
  tags:Tag[];
  total_donate:string;
  campaign_comment:CampaignComment[];
  progress:number;
  featured_image:string;
  payment_info:string;
  packages:Package[];
}
