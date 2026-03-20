from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from users.models import Account
from transactions.models import Transaction
from datetime import date, timedelta
from django.utils import timezone

User = get_user_model()


class ReportGenerationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email_address='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.account = Account.objects.create(
            user=self.user,
            name='Test Account',
            institution='Test Bank',
            balance=1000.00,
            currency='EUR'
        )
        
        # Create some transactions
        Transaction.objects.create(
            account=self.account,
            date=date.today() - timedelta(days=5),
            amount=100.00,
            description='Test transaction',
            transaction_type='debit'
        )

    def test_monthly_report_generation(self):
        response = self.client.get('/api/v1/reports/monthly/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertIn('attachment', response['Content-Disposition'])
        self.assertIn('portfolio-report', response['Content-Disposition'])
        
        # Verify PDF content (basic check)
        self.assertGreater(len(response.content), 0)

