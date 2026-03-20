from django.db import models
from transactions.models import Transaction

# Create your models here.

class ESGScore(models.Model):
  transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='esg_score')
  co2_impact = models.FloatField()  # in kg CO2
  sustainability_rating = models.FloatField()  # 0-10 scale