from django.db.models.signals import post_save
from django.dispatch import receiver
from transactions.models import Transaction
from users.models import Account
from .models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@receiver(post_save, sender=Transaction)
def notify_large_transaction(sender, instance, **kwargs):
    """
    Create notification for large transactions.
    """
    if abs(float(instance.amount)) > 1000:
        notification = Notification.objects.create(
            user=instance.account.user,
            title='Large Transaction',
            message=f"Large transaction: {instance.amount} {instance.account.currency} - {instance.description}",
            notification_type='transaction',
            link=f'/transactions/{instance.id}/'
        )
        
        # Send via WebSocket
        send_notification_websocket(instance.account.user.id, notification)


@receiver(post_save, sender=Account)
def notify_low_balance(sender, instance, **kwargs):
    """
    Create notification for low account balance.
    """
    if float(instance.balance) < 100:
        notification = Notification.objects.create(
            user=instance.user,
            title='Low Balance Alert',
            message=f"Account '{instance.name}' has a low balance: {instance.balance} {instance.currency}",
            notification_type='warning',
            link=f'/accounts/{instance.id}/'
        )
        
        # Send via WebSocket
        send_notification_websocket(instance.user.id, notification)


def send_notification_websocket(user_id, notification):
    """
    Send notification via WebSocket to the user.
    """
    try:
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f'notifications_{user_id}',
                {
                    'type': 'notification_message',
                    'message': {
                        'id': notification.id,
                        'title': notification.title,
                        'message': notification.message,
                        'type': notification.notification_type,
                        'created_at': notification.created_at.isoformat(),
                    }
                }
            )
    except Exception as e:
        # WebSocket not available, fail silently
        print(f"WebSocket error: {e}")

