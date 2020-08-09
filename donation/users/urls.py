from django.conf.urls import url , include
from rest_framework.urlpatterns import format_suffix_patterns
from users import views


urlpatterns = [
    # url(r'^admin/', admin.site.urls),
    url(r'^$',  views.UserList.as_view(), name="user_list"),
    
    url(r'^details/$', views.UserDetail.as_view(),name="user_details"),
    url(r'^donations/$', views.PaymentHistoryOfUser.as_view(),name="user_donation_history"),
    url(r'^donations/report/$', views.UserDonationReport.as_view(),name="user_donation_report"),
    url(r'^update/$', views.UserUpdate.as_view(),name="user_update"),
    url(r'^upload-profile-image/$', views.UserUploadProfileImage.as_view(),name="user_image_upload"),
    url(r'^change-visibility/$', views.UserVisibilityUpdate.as_view(),name="user_change_visibility"),
    url(r'^reset-password/$', views.UserResetPassword.as_view(),name="user_reset_password"),
    url(r'^reset-password-confirmation/(?P<uid>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.UserPasswordResetVerify.as_view(), name="user_reset_password_verify"),
    url(r'^reset-password-done/$', views.UserPasswordResetDone.as_view(),name="user_reset_password_done"),
    url(r'^set-password/$', views.UserPasswordSet.as_view(),name="user_password_set"),
    url(r'^change-password/$', views.UserPasswordChange.as_view(),name="user_password_change"),

    url(r'^change-firstname/$', views.UserFirstNameChange.as_view(),name="user_firstname_change"),
    url(r'^change-lastname/$', views.UserLastNameChange.as_view(),name="user_lastname_change"),
    url(r'^change-phone-number/$', views.UserPhoneNumberChange.as_view(),name="user_phone_no_change"),
    url(r'^change-blood-group/$', views.UserBloodGroupSet.as_view(),name="user_set_blood_group"),
    url(r'^be-blood-donor/$', views.UserBeBloodDonor.as_view(),name="user_be_a_blood_donor"),
    url(r'^be-plasma-donor/$', views.UserBePlasmaDonor.as_view(),name="user_be_a_plasma_donor"),
    url(r'^show-mobile-number/$', views.ShowMobileNumber.as_view(),name="user_show_mobile_number"),

]