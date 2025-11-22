from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from users.models import Account
from .models import Transaction

User = get_user_model()


class TransactionModelTest(TestCase):
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

    def test_transaction_creation(self):
        transaction = Transaction.objects.create(
            account=self.account,
            date='2024-01-01',
            amount=100.00,
            description='Test transaction',
            transaction_type='debit'
        )
        self.assertEqual(transaction.amount, 100.00)
        self.assertEqual(transaction.transaction_type, 'debit')


class TransactionAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
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
        self.client.force_authenticate(user=self.user)

    def test_create_transaction(self):
        data = {
            'account': self.account.id,
            'date': '2024-01-01',
            'amount': 100.00,
            'description': 'Test transaction',
            'transaction_type': 'debit'
        }
        response = self.client.post('/api/v1/transactions/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transaction.objects.count(), 1)

    def test_list_transactions(self):
        Transaction.objects.create(
            account=self.account,
            date='2024-01-01',
            amount=100.00,
            description='Test',
            transaction_type='debit'
        )
        response = self.client.get('/api/v1/transactions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
