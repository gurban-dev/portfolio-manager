from decimal import Decimal

from django.db.models.signals import post_save
from django.dispatch import receiver

from users.models import Account
from transactions.models import Transaction

from .models import Notification

LARGE_TRANSACTION_THRESHOLD = Decimal("1000.00")
LOW_BALANCE_THRESHOLD = Decimal("100.00")


@receiver(post_save, sender=Transaction)
def create_large_transaction_notification(sender, instance, created, **kwargs):
    if not created:
        return

    amount = abs(instance.amount)
    if amount < LARGE_TRANSACTION_THRESHOLD:
        return

    Notification.objects.create(
        user=instance.account.user,
        title="Large Transaction",
        message=(
            f"A {instance.transaction_type} transaction of {amount:.2f} "
            f"{instance.account.currency} was recorded for {instance.account.name}."
        ),
        notification_type="transaction",
    )


@receiver(post_save, sender=Account)
def create_low_balance_notification(sender, instance, **kwargs):
    if instance.balance >= LOW_BALANCE_THRESHOLD:
        return

    Notification.objects.get_or_create(
        user=instance.user,
        title="Low Balance Alert",
        message=(
            f"Your account {instance.name} balance is low at "
            f"{instance.balance:.2f} {instance.currency}."
        ),
        notification_type="warning",
        is_read=False,
    )
