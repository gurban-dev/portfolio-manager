from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from users.models import Account
from transactions.models import Transaction
from .models import Notification
from datetime import date

User = get_user_model()


class NotificationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email_address='test@example.com',
            password='testpass123'
        )

    def test_notification_creation(self):
        notification = Notification.objects.create(
            user=self.user,
            title='Test Notification',
            message='This is a test notification',
            notification_type='info'
        )
        
        self.assertEqual(notification.user, self.user)
        self.assertEqual(notification.title, 'Test Notification')
        self.assertFalse(notification.is_read)

    def test_notification_mark_as_read(self):
        notification = Notification.objects.create(
            user=self.user,
            title='Test',
            message='Test message',
            notification_type='info'
        )
        
        self.assertFalse(notification.is_read)
        notification.is_read = True
        notification.save()
        self.assertTrue(notification.is_read)


class NotificationSignalsTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email_address='test@example.com',
            password='testpass123'
        )
        self.account = Account.objects.create(
            user=self.user,
            name='Test Account',
            institution='Test Bank',
            balance=1000.00,
            currency='EUR'
        )

    def test_large_transaction_notification(self):
        # Create a large transaction (>1000)
        transaction = Transaction.objects.create(
            account=self.account,
            date=date.today(),
            amount=1500.00,
            description='Large investment',
            transaction_type='debit'
        )
        
        # Signal should create notification
        notifications = Notification.objects.filter(user=self.user)
        self.assertTrue(notifications.exists())
        
        large_tx_notif = notifications.filter(title='Large Transaction').first()
        self.assertIsNotNone(large_tx_notif)
        self.assertIn('1500.00', large_tx_notif.message)

    def test_low_balance_notification(self):
        # Set account balance to low value
        self.account.balance = 50.00
        self.account.save()
        
        # Signal should create notification
        notifications = Notification.objects.filter(user=self.user)
        self.assertTrue(notifications.exists())
        
        low_balance_notif = notifications.filter(title='Low Balance Alert').first()
        self.assertIsNotNone(low_balance_notif)


class NotificationAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email_address='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_list_notifications(self):
        Notification.objects.create(
            user=self.user,
            title='Test',
            message='Test message',
            notification_type='info'
        )
        
        response = self.client.get('/api/v1/notifications/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data.get('results', response.data)), 0)

    def test_unread_notifications_filter(self):
        Notification.objects.create(
            user=self.user,
            title='Unread',
            message='Unread message',
            notification_type='info',
            is_read=False
        )
        Notification.objects.create(
            user=self.user,
            title='Read',
            message='Read message',
            notification_type='info',
            is_read=True
        )
        
        response = self.client.get('/api/v1/notifications/?unread=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        notifications = response.data.get('results', response.data)
        self.assertTrue(all(not n.get('is_read', False) for n in notifications))

    def test_mark_notification_as_read(self):
        notification = Notification.objects.create(
            user=self.user,
            title='Test',
            message='Test message',
            notification_type='info',
            is_read=False
        )
        
        response = self.client.patch(
            f'/api/v1/notifications/{notification.id}/',
            {'is_read': True}
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_read'])
        
        notification.refresh_from_db()
        self.assertTrue(notification.is_read)
