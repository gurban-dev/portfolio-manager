from django.db import models
from users.models import Account


class Transaction(models.Model):
  account = models.ForeignKey(
    Account, on_delete=models.CASCADE, related_name='transactions')

  date = models.DateField()

  amount = models.DecimalField(max_digits=15, decimal_places=2)

  description = models.TextField()

  category = models.CharField(max_length=50, null=True, blank=True)

  transaction_type = models.CharField(
    max_length=10, choices=[('credit','Credit'),('debit','Debit')])