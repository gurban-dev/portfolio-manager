from django.db.models.signals import post_save
from django.dispatch import receiver
from transactions.models import Transaction
from .models import ESGScore
import random


def calculate_esg_score(transaction: Transaction):
    """
    Calculate ESG score for a transaction.
    This is a mock implementation - in production, you'd call an ESG API
    or use a more sophisticated calculation.
    """
    # Mock ESG calculation based on transaction characteristics
    base_rating = 7.0
    base_co2 = 5.0
    
    # Adjust based on category
    category = (transaction.category or '').lower()
    if 'solar' in category or 'renewable' in category or 'green' in category:
        base_rating += 2.0
        base_co2 -= 3.0
    elif 'oil' in category or 'fossil' in category or 'coal' in category:
        base_rating -= 2.0
        base_co2 += 5.0
    
    # Adjust based on amount (larger investments have more impact)
    amount_factor = min(float(abs(transaction.amount)) / 10000, 2.0)
    base_co2 *= (1 + amount_factor * 0.5)
    
    # Add some randomness for realism
    rating = max(0, min(10, base_rating + random.uniform(-0.5, 0.5)))
    co2 = max(0, base_co2 * random.uniform(0.8, 1.2))
    
    return {
        'sustainability_rating': round(rating, 2),
        'co2_impact': round(co2, 2)
    }


@receiver(post_save, sender=Transaction)
def create_esg_score(sender, instance, created, **kwargs):
    """
    Automatically create ESG score when a transaction is created.
    Only create for investment-type transactions (debits with certain categories).
    """
    if created:
        # Only generate ESG scores for debit transactions (investments)
        if instance.transaction_type == 'debit':
            # Check if ESG score already exists
            if not hasattr(instance, 'esg_score'):
                esg_data = calculate_esg_score(instance)
                ESGScore.objects.create(
                    transaction=instance,
                    sustainability_rating=esg_data['sustainability_rating'],
                    co2_impact=esg_data['co2_impact']
                )

