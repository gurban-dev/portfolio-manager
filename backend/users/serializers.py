from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
  """Serializer for user details"""
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


class CustomRegisterSerializer(RegisterSerializer):
  """Custom registration serializer with additional fields"""
  first_name = serializers.CharField(required=False, allow_blank=True)
  last_name = serializers.CharField(required=False, allow_blank=True)

  preferred_currency = serializers.ChoiceField(
    choices=['EUR', 'NOK', 'SEK', 'GBP'],
    default='EUR'
  )
  
  def get_cleaned_data(self):
    data = super().get_cleaned_data()
    data['first_name'] = self.validated_data.get('first_name', '')
    data['last_name'] = self.validated_data.get('last_name', '')
    data['preferred_currency'] = self.validated_data.get('preferred_currency', 'EUR')
    return data
  
  def save(self, request):
      user = super().save(request)
      user.first_name = self.cleaned_data.get('first_name', '')
      user.last_name = self.cleaned_data.get('last_name', '')
      user.preferred_currency = self.cleaned_data.get('preferred_currency', 'EUR')
      user.save()
      return user


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