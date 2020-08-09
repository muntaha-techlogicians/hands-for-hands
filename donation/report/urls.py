from django.conf.urls import url , include
from rest_framework.urlpatterns import format_suffix_patterns
from report import views

urlpatterns = [

    url(r'^home/$',views.HomeReport.as_view(),name="report_home"),
    url(r'^blood-donor-home/$',views.BloodDonationHomeReport.as_view(),name="report_blood_donor_home"),
    url(r'^blood-donor-group-report/$',views.BloodDonorGroupReport.as_view(),name="report_blood_donor_group"),
    url(r'^plasma-donor-group-report/$',views.PlasmaDonorGroupReport.as_view(),name="report_plasma_donor_group"),
    url(r'^category/(?P<pk>[0-9]+)/$',views.CategoryReport.as_view(),name="report_category"),
    url(r'^campaign/(?P<pk>[0-9]+)/$',views.CampaignReport.as_view(),name="report_campaign"),
    url(r'^social-share/(?P<pk>[0-9]+)/$',views.CampaignSocialReport.as_view(),name="report_campaign_social_share"),

]