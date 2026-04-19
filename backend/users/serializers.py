from rest_framework import serializers
from allauth.account import app_settings as allauth_account_settings
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from allauth.socialaccount.models import EmailAddress
from allauth.utils import get_username_max_length
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth import get_user_model

User = get_user_model()
signup_email_field = allauth_account_settings.SIGNUP_FIELDS.get('email', {})
signup_username_field = allauth_account_settings.SIGNUP_FIELDS.get('username', {})


class BaseRegisterSerializer(serializers.Serializer):
  """Local copy of dj-rest-auth registration logic using non-deprecated allauth settings."""
  username = serializers.CharField(
    max_length=get_username_max_length(),
    min_length=allauth_account_settings.USERNAME_MIN_LENGTH,
    required=bool(signup_username_field.get('required')),
    allow_blank=not bool(signup_username_field.get('required')),
  )
  email = serializers.EmailField(required=bool(signup_email_field.get('required')))
  password1 = serializers.CharField(write_only=True)
  password2 = serializers.CharField(write_only=True)

  def validate_username(self, username):
    return get_adapter().clean_username(username)

  def validate_email(self, email):
    email = get_adapter().clean_email(email)
    if allauth_account_settings.UNIQUE_EMAIL:
      if email and EmailAddress.objects.is_verified(email):
        raise serializers.ValidationError(
          'A user is already registered with this e-mail address.',
        )
    return email

  def validate_password1(self, password):
    return get_adapter().clean_password(password)

  def validate(self, data):
    if data['password1'] != data['password2']:
      raise serializers.ValidationError("The two password fields didn't match.")
    return data

  def custom_signup(self, request, user):
    pass

  def get_cleaned_data(self):
    return {
      'username': self.validated_data.get('username', ''),
      'password1': self.validated_data.get('password1', ''),
      'email': self.validated_data.get('email', ''),
    }

  def save(self, request):
    adapter = get_adapter()
    user = adapter.new_user(request)
    self.cleaned_data = self.get_cleaned_data()
    user = adapter.save_user(request, user, self, commit=False)
    if 'password1' in self.cleaned_data:
      try:
        adapter.clean_password(self.cleaned_data['password1'], user=user)
      except DjangoValidationError as exc:
        raise serializers.ValidationError(
          detail=serializers.as_serializer_error(exc)
        )
    user.save()
    self.custom_signup(request, user)
    setup_user_email(request, user, [])
    return user

class UserSerializer(serializers.ModelSerializer):
  """Serializer for user details"""
  # Map API 'email' to CustomUser.email_address
  email = serializers.EmailField(source='email_address', read_only=True)

  class Meta:
    model = User

    fields = [
      'id', 
      'email', 
      'username', 
      'first_name', 
      'last_name',
      'preferred_currency',
      'risk_tolerance',
      'esg_preference',
      'created_at'
    ]

    read_only_fields = ['id', 'created_at']


class CustomRegisterSerializer(BaseRegisterSerializer):
  """Custom registration serializer with additional fields"""
  first_name = serializers.CharField(required=False, allow_blank=True)
  last_name = serializers.CharField(required=False, allow_blank=True)

  preferred_currency = serializers.ChoiceField(
    choices=['EUR', 'NOK', 'SEK', 'GBP', 'USD', 'CHF'],
    default='EUR'
  )

  risk_tolerance = serializers.ChoiceField(
    choices=['conservative', 'moderate', 'aggressive'],
    default='moderate', required=False
  )

  esg_preference = serializers.IntegerField(default=70, required=False)
  
  def get_cleaned_data(self):
    data = super().get_cleaned_data()
    data['first_name'] = self.validated_data.get('first_name', '')
    data['last_name'] = self.validated_data.get('last_name', '')
    data['preferred_currency'] = self.validated_data.get('preferred_currency', 'EUR')
    data['risk_tolerance'] = self.validated_data.get('risk_tolerance', 'moderate')
    data['esg_preference'] = self.validated_data.get('esg_preference', 70)
    return data
  
  def save(self, request):
      user = super().save(request)
      user.first_name = self.cleaned_data.get('first_name', '')
      user.last_name = self.cleaned_data.get('last_name', '')
      user.preferred_currency = self.cleaned_data.get('preferred_currency', 'EUR')
      # Set additional preferences
      user.risk_tolerance = self.cleaned_data.get('risk_tolerance', 'moderate')
      user.esg_preference = self.cleaned_data.get('esg_preference', 70)
      # Ensure CustomUser.email_address is populated
      if hasattr(user, 'email_address'):
        if not user.email_address:
          # dj-rest-auth/allauth provides 'email' in cleaned data
          user.email_address = self.cleaned_data.get('email', getattr(user, 'email', ''))
      user.save()
      return user


class VerifyEmailSerializer(serializers.Serializer):
  key = serializers.CharField(write_only=True)


class ResendEmailVerificationSerializer(serializers.Serializer):
  email = serializers.EmailField(required=bool(signup_email_field.get('required')))


class GoogleLoginSerializer(serializers.Serializer):
  """Serializer for Google OAuth login"""
  access_token = serializers.CharField(required=True)
  
  def validate_access_token(self, access_token):
    """Validate Google access token"""
    import requests
    
    # Verify token with Google
    response = requests.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      headers={'Authorization': f'Bearer {access_token}'}
    )
    
    if response.status_code != 200:
      raise serializers.ValidationError('Invalid access token')
    
    return access_token
