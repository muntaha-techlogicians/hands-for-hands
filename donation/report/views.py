from rest_framework.views import APIView
from django.contrib.auth.models import User
from users.models import Profile
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from campaign.models import Campaign,Donate,SocialShare
from django.db.models import Sum
import datetime
import calendar

class HomeReport(APIView):
    #renderer_classes = (JSONRenderer, )
    def get(self,request,format=None):
        campaign_count = Campaign.objects.filter(status=1).count()
        target_fund = Campaign.objects.filter(status=1).aggregate(total=Sum('amount'))
        raised_fund = Donate.objects.filter(campaign__status=1).aggregate(total=Sum('amount'))
        total_donor = User.objects.filter(is_superuser=0,is_staff=0).count()
        content = {
            'total_campaign': campaign_count,
            'target_fund':target_fund['total'],
            'raised_fund':raised_fund['total'],
            'total_donor':total_donor

        }
        return Response(content)

class CategoryReport(APIView):

    def get(self,request,pk,format=None):
        campaign_count = Campaign.objects.filter(category_id=pk,status=1).count()
        target_fund = Campaign.objects.filter(category_id=pk,status=1).aggregate(total=Sum('amount'))
        raised_fund = Donate.objects.filter(campaign__category_id=pk,campaign__status=1).aggregate(total=Sum('amount'))
        # total_donor = User.objects.filter(is_superuser=0,is_staff=0).count()

        total_number_of_donor_in_platform = Donate.objects.filter(campaign__category_id=pk).exclude(user=None).values('user').distinct().count()
        total_number_of_donor_outside_platform = Donate.objects.filter(user=None,campaign__category_id=pk).count()
        total_donor = total_number_of_donor_in_platform+total_number_of_donor_outside_platform

        content = {
            'total_campaign': campaign_count,
            'target_fund':target_fund['total'],
            'raised_fund':raised_fund['total'],
            'total_donor':total_donor

        }
        return Response(content)


class CampaignReport(APIView):

    def get(self,request,pk,format=None):
        today = datetime.date.today()
        _, num_days = calendar.monthrange(today.year, today.month)
        first_day = datetime.date(today.year, today.month, 1)
        last_day = datetime.date(today.year, today.month, num_days)
        target_fund = Campaign.objects.filter(id=pk)
        raised_fund = Donate.objects.filter(campaign_id=pk).exclude(status__in=['pending','declined','mismatched']).aggregate(total=Sum('amount'))
        # total_donor = Donate.objects.filter(campaign_id=pk).count()
        total_number_of_donor_in_platform = Donate.objects.filter(campaign_id=pk).exclude(user=None).values('user').distinct().count()
        total_number_of_donor_outside_platform = Donate.objects.filter(user=None,campaign_id=pk).count()
        total_donor = total_number_of_donor_in_platform+total_number_of_donor_outside_platform

        # monthly_donor = Donate.objects.filter(created_at__gte=first_day,created_at__lte=last_day,campaign_id=pk).count()
        monthly_donor_in_platform = Donate.objects.filter(created_at__gte=first_day,created_at__lte=last_day,campaign_id=pk).exclude(user=None).values('user').distinct().count()
        monthly_donor_outside_platform = Donate.objects.filter(created_at__gte=first_day,created_at__lte=last_day,campaign_id=pk,user=None).count()
        monthly_donor = monthly_donor_in_platform+monthly_donor_outside_platform
        content = {
            'target_fund':target_fund[0].amount,
            'raised_fund':raised_fund['total'],
            'total_donor':total_donor,
            'monthly_donor':monthly_donor

        }
        return Response(content)

class CampaignSocialReport(APIView):

    def get(self,request,pk,format=None):
        facebook = SocialShare.objects.filter(campaign_id=pk,social_network='facebook').aggregate(total=Sum('count'))
        google = SocialShare.objects.filter(campaign_id=pk,social_network='google').aggregate(total=Sum('count'))
        twitter = SocialShare.objects.filter(campaign_id=pk,social_network='twitter').aggregate(total=Sum('count'))
        linkdin = SocialShare.objects.filter(campaign_id=pk,social_network='linkdin').aggregate(total=Sum('count'))
        content = {
            'facebook':facebook['total'] if facebook['total'] != None else 0,
            'google':google['total'] if google['total'] != None else 0,
            'twitter':twitter['total'] if twitter['total'] != None else 0,
            'linkdin':linkdin['total'] if linkdin['total'] != None else 0

        }
        return Response(content)

class BloodDonationHomeReport(APIView):

    def get(self,request):
        total_blood_donor = Profile.objects.filter(is_blood_donor=True).count()
        total_plasma_donor = Profile.objects.filter(is_plasma_donor=True).count()

        content = {
            'total_blood_donor':total_blood_donor,
            'total_plasma_donor':total_plasma_donor,
            'total_blood_search':0,
            'total_plasma_search':0

        }
        return Response(content)

class PlasmaDonorGroupReport(APIView):
    def get(self,request):
        a_positive = Profile.objects.filter(is_plasma_donor=True).filter(blood_group='A+').count()
        a_negative = Profile.objects.filter(is_plasma_donor=True).filter(blood_group='A-').count()
        b_positive = Profile.objects.filter(is_plasma_donor=True).filter(blood_group='B+').count()
        b_negative = Profile.objects.filter(is_plasma_donor=True).filter(blood_group='B-').count()
        o_positive = Profile.objects.filter(is_plasma_donor=True).filter(blood_group='O+').count()
        o_negative = Profile.objects.filter(is_plasma_donor=True).filter(blood_group='O-').count()
        ab_positive = Profile.objects.filter(is_plasma_donor=True).filter(blood_group='AB+').count()
        ab_negative = Profile.objects.filter(is_plasma_donor=True).filter(blood_group='AB-').count()

        content = {
                'a_positive':a_positive,
                'a_negative':a_negative,
                'b_positive':b_positive,
                'b_negative':b_negative,
                'o_positive':o_positive,
                'o_negative':o_negative,
                'ab_positive':ab_positive,
                'ab_negative':ab_negative

        }
        return Response(content)

class BloodDonorGroupReport(APIView):
    def get(self,request):
        a_positive = Profile.objects.filter(is_blood_donor=True).filter(blood_group='A+').count()
        a_negative = Profile.objects.filter(is_blood_donor=True).filter(blood_group='A-').count()
        b_positive = Profile.objects.filter(is_blood_donor=True).filter(blood_group='B+').count()
        b_negative = Profile.objects.filter(is_blood_donor=True).filter(blood_group='B-').count()
        o_positive = Profile.objects.filter(is_blood_donor=True).filter(blood_group='O+').count()
        o_negative = Profile.objects.filter(is_blood_donor=True).filter(blood_group='O-').count()
        ab_positive = Profile.objects.filter(is_blood_donor=True).filter(blood_group='AB+').count()
        ab_negative = Profile.objects.filter(is_blood_donor=True).filter(blood_group='AB-').count()

        content = {
                'a_positive':a_positive,
                'a_negative':a_negative,
                'b_positive':b_positive,
                'b_negative':b_negative,
                'o_positive':o_positive,
                'o_negative':o_negative,
                'ab_positive':ab_positive,
                'ab_negative':ab_negative

        }
        return Response(content)

