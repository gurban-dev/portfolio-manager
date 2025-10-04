from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Transaction
    fields = ['id', 'account', 'date', 'amount', 'description', 'category', 'transaction_type']