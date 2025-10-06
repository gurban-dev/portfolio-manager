from rest_framework import serializers
from .models import ESGScore


class ESGScoreSerializer(serializers.ModelSerializer):
  class Meta:
    model = ESGScore
    fields = ['id', 'transaction', 'co2_impact', 'sustainability_rating']
    read_only_fields = ['id']