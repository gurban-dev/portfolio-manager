from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser
from transactions.models import Account

'''
In Django, the standard way to automatically create related objects
when another model is created is to use signals — specifically, the
post_save signal. You can do this for your CustomUser so that whenever
a user is created, an Account is automatically created for them.
'''

@receiver(post_save, sender=CustomUser)
def create_account_for_user(sender, instance, created, **kwargs):
  if created:
    Account.objects.create(
      user=instance,
      name=f"{instance.first_name}'s Account",
      institution='Default Bank',
      balance=0,
      currency=instance.preferred_currency
    )