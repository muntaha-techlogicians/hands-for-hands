from rest_framework 			import generics,status
from django.contrib.auth.models import User
from campaign.models 			import Donate
from users.serializers 			import UserDetailsSerializer,UserProfileSerializer
from users.serializers 			import UsersListSerializer
from users.serializers 			import PaymentHistoryOfUserSerializer
from users.serializers 			import CustomPasswordResetSerializer, CustomResetLinkValidatorSerializer
from rest_auth.serializers      import PasswordResetConfirmSerializer
from api.permissions            import IsOwner
from django.shortcuts           import get_object_or_404
from rest_framework.views       import APIView
from rest_framework.generics    import GenericAPIView
from rest_auth.views import PasswordResetView, PasswordChangeView
from rest_framework.permissions import (
    IsAuthenticated,AllowAny
    )
from rest_framework.response import Response
from django.db.models import Sum
import json
from users.models import Profile
from rest_framework.parsers import FileUploadParser
from rest_framework.parsers import MultiPartParser
from rest_framework.parsers import FormParser

from users.serializers import CustomPasswordChangeSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,IsOwner,)
    queryset = User.objects.all()
    serializer_class = UserDetailsSerializer

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = queryset.get(pk=self.request.user.id)
        self.check_object_permissions(self.request, obj)
        return obj

class UserList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)

    queryset = User.objects.all()

    serializer_class = UsersListSerializer

class PaymentHistoryOfUser(generics.ListAPIView):

    permission_classes = (IsAuthenticated,IsOwner,)
    serializer_class = PaymentHistoryOfUserSerializer

    def get_queryset(self):
        return Donate.objects.filter(user_id=self.request.user.id)


class UserDonationReport(APIView):
    permission_classes = (IsAuthenticated,IsOwner,)

    def get(self,format=None):
        donations= Donate.objects.filter(user_id=self.request.user.id)
        total_donation_count = donations.count()
        total_donations = Donate.objects.filter(user_id=self.request.user.id).aggregate(total=Sum('amount'))
        total_campaign_counnt = donations.values('campaign_id').distinct().count()
        content = {
            'total_donation_count':total_donation_count ,
            'total_campaign_counnt':total_campaign_counnt,
            'total_donation':total_donations['total'] if total_donations['total'] != None else 0

        }
        return Response(content)

class UserUpdate(APIView):
    permission_classes =(IsOwner,IsAuthenticated,)

    def post(self,request):
        data = json.loads(request.POST.dict().keys()[0])
        firstname=data['firstname']
        lastname=data['lastname']
        user =request.user
        user.first_name=firstname
        user.last_name=lastname
        user.save()
        result =UserDetailsSerializer(user)
        return Response(result.data,status=status.HTTP_200_OK)

class UserUploadProfileImage(APIView):
    permission_classes =(IsOwner,IsAuthenticated,)
    parser_classes = (MultiPartParser, )
    def post(self,request):
        file = request.data['file']
        profile = Profile.objects.filter(user_id=request.user.id)
        if profile.exists():
            is_private=profile[0].is_private
            profile.delete()
            profile = Profile.objects.create(user_id=request.user.id,image=file,is_private=is_private)
        else:
            profile = Profile.objects.create(user_id=request.user.id,image=file)


        result = UserProfileSerializer(profile)
        return Response(result.data,status=status.HTTP_200_OK)

class UserVisibilityUpdate(APIView):
    permission_classes = (IsOwner,IsAuthenticated,)

    def post(self,request):
        user=request.user
        data = json.loads(request.POST.dict().keys()[0])
        is_private=data['is_private']
        profile = Profile.objects.filter(user_id=user.id)
        if profile.exists():
            profile.update(is_private=is_private)
        else:
            Profile.objects.create(user_id=request.user.id,is_private=is_private)

        return Response(True,status=status.HTTP_200_OK)


class UserFirstNameChange(APIView):
    permission_classes = (IsOwner,IsAuthenticated,)

    def post(self,request):
        user = request.user
        firstname = request.data.get('first_name')
        user.first_name = firstname
        user.save()
        return Response(True,status=status.HTTP_200_OK)

class UserLastNameChange(APIView):
    permission_classes = (IsOwner,IsAuthenticated,)

    def post(self,request):
        user = request.user
        lastname = request.data.get('last_name')
        user.last_name = lastname
        user.save()
        return Response(True,status=status.HTTP_200_OK)


class UserPhoneNumberChange(APIView):
    permission_classes = (IsOwner,IsAuthenticated,)

    def post(self,request):
        user = request.user
        new_phone_no = request.data.get('phone_number')
        user.profile.phone_no = new_phone_no
        user.save()
        return Response(True,status=status.HTTP_200_OK)

class UserBloodGroupSet(APIView):
    permission_classes = (IsOwner,IsAuthenticated,)

    def post(self,request):
        user = request.user
        blood_group = request.data.get('blood_group')
        user.profile.blood_group = blood_group
        user.save()
        return Response(True,status=status.HTTP_200_OK)

class UserBeBloodDonor(APIView):

    permission_classes = (IsOwner,IsAuthenticated,)

    def post(self,request):
        user = request.user
        blood_donor = request.data.get('blood_donor')
        blood_donor = True if blood_donor == 'Y' else False
        user.profile.is_blood_donor = blood_donor
        user.save()
        return Response(True,status=status.HTTP_200_OK)

class UserBePlasmaDonor(APIView):

    permission_classes = (IsOwner,IsAuthenticated,)

    def post(self,request):
        user = request.user
        blood_donor = request.data.get('plasma_donor')
        covid_recover_date = request.data.get('covid_recover_date')
        blood_donor = True if blood_donor == 'Y' else False
        user.profile.is_plasma_donor = blood_donor
        user.profile.covid_recover_date = covid_recover_date
        user.save()
        return Response(True,status=status.HTTP_200_OK)

class ShowMobileNumber(APIView):
    permission_classes = (IsOwner,IsAuthenticated,)

    def post(self,request):
        user = request.user
        show_mobile_number = request.data.get('show_mobile_number')
        show_mobile_number = True if show_mobile_number == 'Y' else False
        user.profile.show_mobile_number = show_mobile_number
        user.save()
        return Response(True,status=status.HTTP_200_OK)


class UserResetPassword(PasswordResetView):
    """
    Send Reset Link to email
    Returns the success/fail message.
    """
    serializer_class = CustomPasswordResetSerializer
    permission_classes = (AllowAny,)


class UserPasswordResetDone(GenericAPIView):

    """
    Password reset e-mail link is confirmed, therefore this resets the user's password.
    Accepts the following POST parameters: new_password1, new_password2
    Accepts the following Django URL arguments: token, uid
    Returns the success/fail message.
    """

    serializer_class = PasswordResetConfirmSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": "Password has been reset with the new password."})

class UserPasswordResetVerify(GenericAPIView):

    serializer_class = CustomResetLinkValidatorSerializer
    permission_classes = (AllowAny,)

    def get(self, request,**kwargs):
        # print(request);
        serializer = self.get_serializer(data=kwargs)
        serializer.is_valid(raise_exception=True)
        return Response({"success": "Password reset request is successfully verified", "uid" : kwargs['uid'], "token": kwargs['token']})


class UserPasswordSet(PasswordChangeView):
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": "Password has been changed."})


class UserPasswordChange(PasswordChangeView):

    serializer_class = CustomPasswordChangeSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": "Password has been changed."})