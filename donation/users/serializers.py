from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode as uid_decoder
from django.contrib.auth.models import User
from django.conf import settings
from users.models import Profile
from campaign.models import Donate
from campaign.serializers import CampaignInfoForDonationsSerializer,CampaignListSerializer
from rest_auth.registration.serializers import RegisterSerializer
from rest_auth.serializers import PasswordResetSerializer, PasswordChangeSerializer
import json

from allauth.account import app_settings as allauth_settings
from allauth.utils import (email_address_exists,get_username_max_length)
from allauth.socialaccount.models import SocialAccount
from django.contrib.auth.tokens import default_token_generator

from rest_auth.app_settings import LoginSerializer
from rest_framework import serializers, exceptions
from rest_framework.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

class CustomLoginSerializer(LoginSerializer):

    email = serializers.EmailField(required=False, allow_blank=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = None

        # Authentication without using allauth
        if email:
            try:
                username = User.objects.get(email__iexact=email).get_username()
            except User.DoesNotExist:
                pass

        if username:
            user = self._validate_username_email(username, '', password)

        # Did we get back an active user?
        if user:
            if not user.is_active:
                msg = _('User account is disabled.')
                raise exceptions.ValidationError(msg)
        else:
            msg = _('Unable to log in with provided credentials.')
            raise exceptions.ValidationError(msg)

        # If required, is the email verified?
        if 'rest_auth.registration' in settings.INSTALLED_APPS:
            from allauth.account import app_settings
            if app_settings.EMAIL_VERIFICATION == app_settings.EmailVerificationMethod.MANDATORY:
                email_address = user.emailaddress_set.get(email=user.email)
                if not email_address.verified:
                    raise serializers.ValidationError(_('E-mail is not verified.'))

        attrs['user'] = user
        return attrs



class UserProfileSerializer(serializers.ModelSerializer):
    # owner=serializers.ReadOnlyField(source='user.email')

    social_only = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('id','image_url','is_private','social_only','blood_group','covid_recover_date','is_blood_donor','is_plasma_donor','show_mobile_number','phone_no')

    def get_social_only(self, obj):
        return obj.social_only


class UserDetailsSerializer(serializers.ModelSerializer):

    profile=UserProfileSerializer()

    class Meta:
        model = User
        fields = ('id','username','first_name','last_name','email','date_joined','profile',)
        # fields = '__all__'


class UsersListSerializer(serializers.ModelSerializer):

    class Meta:
        model   = User
        fields  = ('id','username')


class PaymentHistoryOfUserSerializer(serializers.ModelSerializer):
    campaign    = CampaignListSerializer()
    # user        = UserDetailsForDotanationsSerializer();

    class Meta:
        model = Donate
        # fields = ('name')
        fields = ('id','amount','donate_at','campaign','status')


class CustomRegisterSerializer(RegisterSerializer): 
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_settings.USERNAME_MIN_LENGTH,
        required=allauth_settings.USERNAME_REQUIRED
    )
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    first_name = serializers.CharField()
    last_name = serializers.CharField()

    def get_cleaned_data(self):
        super(CustomRegisterSerializer, self).get_cleaned_data()
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password2', ''),
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', '')
        }

    def custom_signup(self, request, user):
        print user
        return user

    def save(self, request):
        # print request
        user = super(CustomRegisterSerializer, self).save(request)
        return user


class CustomPasswordResetSerializer(PasswordResetSerializer):
    """
    Serializer for requesting a password reset e-mail.
    """

    email_template_name = 'users/password_reset_email.html'
    domain_override = settings.EMAIL_BASE_DOMAIN
    use_https = settings.EMAIL_BASE_DOMAIN_PROTOCOL_TLS

    def validate_email(self, value):

            # Create PasswordResetForm with the serializer
            self.reset_form = self.password_reset_form_class(data=self.initial_data)
            if not self.reset_form.is_valid():
                raise serializers.ValidationError('Error')

            user = User.objects.filter(email=value)
            # return user
            if not user.exists():
                raise serializers.ValidationError('Invalid e-mail address')

            if SocialAccount.objects.filter(user=user).exists():
                raise serializers.ValidationError('Not Allowed to reset password')

            return value

    def save(self):
        request = self.context.get('request')
        # Set some values to trigger the send_email method.
        opts = {
            'use_https': self.use_https,
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
            'email_template_name': self.email_template_name,
            'html_email_template_name': self.email_template_name,
            'domain_override': self.domain_override,
            'request': request,
        }

        opts.update(self.get_email_options())
        self.reset_form.save(**opts)


class CustomResetLinkValidatorSerializer(serializers.Serializer):
    """
    Serializer for validating reset password link.
    """
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

    def validate(self, attrs):
        self._errors = {}
        # Decode the uidb64 to uid to get User object
        try:
            uid = force_text(uid_decoder(attrs['uid']))
            self.user = User._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise ValidationError({'uid': ['Invalid User']})

        if not default_token_generator.check_token(self.user, attrs['token']):
            raise ValidationError({'token': ['Invalid Token']})

        return attrs


class CustomPasswordChangeSerializer(PasswordChangeSerializer):

    def __init__(self, *args, **kwargs):
        self.old_password_field_enabled = getattr(
            settings, 'OLD_PASSWORD_FIELD_ENABLED', True
        )
        self.logout_on_password_change = getattr(
            settings, 'LOGOUT_ON_PASSWORD_CHANGE', False
        )
        super(PasswordChangeSerializer, self).__init__(*args, **kwargs)

        if not self.old_password_field_enabled:
            self.fields.pop('old_password')

        self.request = self.context.get('request')
        self.user = getattr(self.request, 'user', None)
