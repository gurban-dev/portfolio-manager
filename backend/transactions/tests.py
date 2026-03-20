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

    def test_transaction_account_relationship(self):
        transaction = Transaction.objects.create(
            account=self.account,
            date='2024-01-01',
            amount=100.00,
            description='Test',
            transaction_type='credit'
        )
        self.assertEqual(transaction.account, self.account)
        self.assertEqual(transaction.account.user, self.user)


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
        self.assertGreaterEqual(len(response.data.get('results', response.data)), 1)

    def test_filter_transactions_by_account(self):
        Transaction.objects.create(
            account=self.account,
            date='2024-01-01',
            amount=100.00,
            description='Test',
            transaction_type='debit'
        )
        response = self.client.get(f'/api/v1/transactions/?account_id={self.account.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_transactions_by_category(self):
        Transaction.objects.create(
            account=self.account,
            date='2024-01-01',
            amount=100.00,
            description='Test',
            category='Investment',
            transaction_type='debit'
        )
        response = self.client.get('/api/v1/transactions/?category=Investment')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_transaction(self):
        transaction = Transaction.objects.create(
            account=self.account,
            date='2024-01-01',
            amount=100.00,
            description='Test',
            transaction_type='debit'
        )
        data = {'description': 'Updated description'}
        response = self.client.patch(f'/api/v1/transactions/{transaction.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        transaction.refresh_from_db()
        self.assertEqual(transaction.description, 'Updated description')

    def test_delete_transaction(self):
        transaction = Transaction.objects.create(
            account=self.account,
            date='2024-01-01',
            amount=100.00,
            description='Test',
            transaction_type='debit'
        )
        response = self.client.delete(f'/api/v1/transactions/{transaction.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Transaction.objects.count(), 0)
