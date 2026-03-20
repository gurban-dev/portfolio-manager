from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from users.models import Account
from transactions.models import Transaction
from .models import ESGScore
from .signals import calculate_esg_score
from .recommendations import get_esg_recommendations
from datetime import date

User = get_user_model()


class ESGScoreModelTest(TestCase):
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

    def test_esg_score_creation(self):
        transaction = Transaction.objects.create(
            account=self.account,
            date=date.today(),
            amount=100.00,
            description='Solar investment',
            category='solar',
            transaction_type='debit'
        )
        
        esg_score = ESGScore.objects.create(
            transaction=transaction,
            co2_impact=5.0,
            sustainability_rating=8.5
        )
        
        self.assertEqual(esg_score.transaction, transaction)
        self.assertEqual(esg_score.co2_impact, 5.0)
        self.assertEqual(esg_score.sustainability_rating, 8.5)

    def test_esg_score_auto_creation_signal(self):
        transaction = Transaction.objects.create(
            account=self.account,
            date=date.today(),
            amount=500.00,
            description='Green investment',
            category='renewable',
            transaction_type='debit'
        )
        
        # Signal should automatically create ESG score
        self.assertTrue(hasattr(transaction, 'esg_score'))
        self.assertIsNotNone(transaction.esg_score)
        self.assertGreater(transaction.esg_score.sustainability_rating, 0)

    def test_esg_calculation(self):
        transaction = Transaction.objects.create(
            account=self.account,
            date=date.today(),
            amount=1000.00,
            description='Solar ETF',
            category='solar',
            transaction_type='debit'
        )
        
        esg_data = calculate_esg_score(transaction)
        
        self.assertIn('sustainability_rating', esg_data)
        self.assertIn('co2_impact', esg_data)
        self.assertGreaterEqual(esg_data['sustainability_rating'], 0)
        self.assertLessEqual(esg_data['sustainability_rating'], 10)
        self.assertGreaterEqual(esg_data['co2_impact'], 0)


class ESGRecommendationsTest(TestCase):
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

    def test_recommendations_with_no_esg_scores(self):
        recommendations = get_esg_recommendations(self.user)
        self.assertIsInstance(recommendations, list)
        self.assertTrue(len(recommendations) > 0)

    def test_recommendations_with_low_esg_rating(self):
        transaction = Transaction.objects.create(
            account=self.account,
            date=date.today(),
            amount=1000.00,
            description='Fossil fuel investment',
            category='oil',
            transaction_type='debit'
        )
        
        ESGScore.objects.create(
            transaction=transaction,
            co2_impact=50.0,
            sustainability_rating=3.0
        )
        
        recommendations = get_esg_recommendations(self.user)
        self.assertIsInstance(recommendations, list)
        # Should have recommendations for improvement
        improvement_recs = [r for r in recommendations if r.get('type') == 'improvement']
        self.assertTrue(len(improvement_recs) > 0)


class ESGAPITest(TestCase):
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

    def test_esg_scores_list(self):
        transaction = Transaction.objects.create(
            account=self.account,
            date=date.today(),
            amount=100.00,
            description='Test',
            transaction_type='debit'
        )
        
        ESGScore.objects.create(
            transaction=transaction,
            co2_impact=5.0,
            sustainability_rating=7.5
        )
        
        response = self.client.get('/api/v1/investments/esg-scores/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data.get('results', response.data)), 0)

    def test_esg_recommendations_endpoint(self):
        response = self.client.get('/api/v1/investments/esg-scores/recommendations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('recommendations', response.data)
        self.assertIsInstance(response.data['recommendations'], list)
