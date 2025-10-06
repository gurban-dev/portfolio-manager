from rest_framework import serializers
from users.models import Account
from .models import Transaction

class AccountSerializer(serializers.ModelSerializer):
  class Meta:
    model = Account
    fields = ['id', 'user', 'name', 'institution', 'balance', 'currency']
    read_only_fields = ['id']

class TransactionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Transaction
    fields = ['id', 'account', 'date', 'amount', 'description', 'category', 'transaction_type']