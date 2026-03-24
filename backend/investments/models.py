from django.db import models
from transactions.models import Transaction


class ESGScoreManager(models.Manager):
  def create(self, **kwargs):
    transaction = kwargs.get('transaction')
    if transaction is None:
      return super().create(**kwargs)

    defaults = {
      'co2_impact': kwargs.get('co2_impact'),
      'sustainability_rating': kwargs.get('sustainability_rating'),
    }
    obj, _ = self.update_or_create(transaction=transaction, defaults=defaults)
    return obj


class ESGScore(models.Model):
  objects = ESGScoreManager()

  transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='esg_score')
  co2_impact = models.FloatField()  # in kg CO2
  sustainability_rating = models.FloatField()  # 0-10 scale
