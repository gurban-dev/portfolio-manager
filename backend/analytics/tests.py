from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from users.models import Account
from transactions.models import Transaction
from investments.models import ESGScore
from datetime import date, timedelta
from .services import compute_portfolio_time_series, compute_esg_series
from .risk_metrics import calculate_risk_metrics

User = get_user_model()


class AnalyticsServiceTest(TestCase):
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

    def test_compute_portfolio_time_series(self):
        # Create some transactions
        Transaction.objects.create(
            account=self.account,
            date=date.today() - timedelta(days=10),
            amount=100.00,
            description='Test transaction',
            transaction_type='debit'
        )
        
        currency, series = compute_portfolio_time_series(
            self.user,
            date.today() - timedelta(days=30),
            date.today(),
            'daily'
        )
        
        self.assertIsNotNone(currency)
        self.assertIsInstance(series, list)
        self.assertTrue(len(series) > 0)

    def test_compute_esg_series(self):
        # Create transaction with ESG score
        transaction = Transaction.objects.create(
            account=self.account,
            date=date.today() - timedelta(days=5),
            amount=500.00,
            description='Green investment',
            category='solar',
            transaction_type='debit'
        )
        
        ESGScore.objects.create(
            transaction=transaction,
            co2_impact=10.5,
            sustainability_rating=8.5
        )
        
        series, total_co2, avg_rating = compute_esg_series(
            self.user,
            date.today() - timedelta(days=30),
            date.today(),
            'daily'
        )
        
        self.assertIsInstance(series, list)
        self.assertIsInstance(total_co2, (int, float))
        self.assertIsInstance(avg_rating, (int, float))

    def test_calculate_risk_metrics(self):
        # Create transactions
        Transaction.objects.create(
            account=self.account,
            date=date.today() - timedelta(days=5),
            amount=1000.00,
            description='Investment',
            transaction_type='debit'
        )
        
        metrics = calculate_risk_metrics(self.user)
        
        self.assertIn('risk_score', metrics)
        self.assertIn('expected_return', metrics)
        self.assertIn('sharpe_ratio', metrics)
        self.assertIn('volatility', metrics)
        self.assertIsInstance(metrics['risk_score'], (int, float))
        self.assertIsInstance(metrics['expected_return'], (int, float))


class AnalyticsAPITest(TestCase):
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

    def test_performance_endpoint(self):
        response = self.client.get('/api/v1/analytics/performance/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('currency', response.data)
        self.assertIn('series', response.data)

    def test_esg_endpoint(self):
        response = self.client.get('/api/v1/analytics/esg/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('series', response.data)
        self.assertIn('total_co2_kg', response.data)
        self.assertIn('avg_rating', response.data)

    def test_risk_endpoint(self):
        response = self.client.get('/api/v1/analytics/risk/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('risk_score', response.data)
        self.assertIn('expected_return', response.data)
        self.assertIn('sharpe_ratio', response.data)
        self.assertIn('volatility', response.data)

