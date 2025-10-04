from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
  role_choices = [('user', 'User'), ('admin', 'Admin')]
  role = models.CharField(max_length=10, choices=role_choices, default='user')
  preferred_currency = models.CharField(max_length=3, default='EUR')


class Account(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')
  name = models.CharField(max_length=100)
  institution = models.CharField(max_length=100)
  balance = models.DecimalField(max_digits=15, decimal_places=2)
  currency = models.CharField(max_length=3, default='EUR')