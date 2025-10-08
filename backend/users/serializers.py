from rest_framework import serializers
from .models import CustomUser, Account


class AccountSerializer(serializers.ModelSerializer):
  class Meta:
    model = Account

    fields = [
      'id',
      'user',
      'name',
      'institution',
      'balance',
      'currency',
    ]

    read_only_fields = ['id']


class UserSerializer(serializers.ModelSerializer):
  # Nested accounts
  accounts = AccountSerializer(many=True, read_only=True)

  class Meta:
    model = CustomUser

    fields = [
      'id',
      'username',
      'email',
      'role',
      'preferred_currency',
      'accounts'
    ]

    read_only_fields = ['id', 'accounts']