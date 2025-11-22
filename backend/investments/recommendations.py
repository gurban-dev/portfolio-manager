from django.db.models import Avg
from transactions.models import Transaction
from investments.models import ESGScore
from users.models import Account


def get_esg_recommendations(user):
    """
    Generate ESG investment recommendations for a user.
    Analyzes current portfolio and suggests improvements.
    """
    recommendations = []
    
    # Get user's current ESG performance
    esg_scores = ESGScore.objects.filter(transaction__account__user=user)
    
    if not esg_scores.exists():
        return [{
            'type': 'info',
            'title': 'Start Tracking ESG Impact',
            'message': 'Add investment transactions to start tracking your ESG impact and receive recommendations.',
            'priority': 'low'
        }]
    
    avg_rating = esg_scores.aggregate(Avg('sustainability_rating'))['sustainability_rating__avg'] or 0
    total_co2 = sum(score.co2_impact for score in esg_scores)
    
    # Recommendation 1: Improve ESG rating
    if avg_rating < 7.0:
        recommendations.append({
            'type': 'improvement',
            'title': 'Improve Portfolio ESG Rating',
            'message': f'Your current ESG rating is {avg_rating:.2f}/10. Consider investing in renewable energy, green bonds, or sustainable ETFs to improve your rating.',
            'priority': 'high',
            'action': 'Explore sustainable investment options'
        })
    
    # Recommendation 2: Reduce CO2 impact
    if total_co2 > 50:
        recommendations.append({
            'type': 'reduction',
            'title': 'Reduce Carbon Footprint',
            'message': f'Your portfolio has a CO₂ impact of {total_co2:.2f} kg. Consider divesting from fossil fuels and investing in carbon-neutral alternatives.',
            'priority': 'high',
            'action': 'Review high-carbon investments'
        })
    
    # Recommendation 3: Diversify with green investments
    transactions = Transaction.objects.filter(account__user=user, transaction_type='debit')
    green_categories = ['solar', 'renewable', 'green', 'sustainable', 'esg']
    has_green = any(
        any(keyword in (tx.category or '').lower() for keyword in green_categories)
        for tx in transactions
    )
    
    if not has_green:
        recommendations.append({
            'type': 'diversification',
            'title': 'Add Green Investments',
            'message': 'Consider adding renewable energy or sustainable technology investments to diversify your portfolio and improve ESG scores.',
            'priority': 'medium',
            'action': 'Explore green investment opportunities'
        })
    
    # Recommendation 4: Portfolio rebalancing
    accounts = Account.objects.filter(user=user)
    if accounts.count() > 1:
        total_balance = sum(float(acc.balance) for acc in accounts)
        if total_balance > 0:
            # Check if portfolio is well-balanced
            max_account_share = max(float(acc.balance) / total_balance for acc in accounts)
            if max_account_share > 0.6:
                recommendations.append({
                    'type': 'rebalancing',
                    'title': 'Rebalance Portfolio',
                    'message': 'Your portfolio is heavily weighted in one account. Consider diversifying across multiple accounts for better risk management.',
                    'priority': 'medium',
                    'action': 'Review portfolio allocation'
                })
    
    # Recommendation 5: ESG goal achievement
    user_esg_preference = getattr(user, 'esg_preference', 70)
    if avg_rating * 10 < user_esg_preference:
        recommendations.append({
            'type': 'goal',
            'title': 'ESG Goal Progress',
            'message': f'Your current ESG rating ({avg_rating * 10:.0f}/100) is below your target ({user_esg_preference}/100). Focus on sustainable investments to reach your goal.',
            'priority': 'high',
            'action': 'Adjust investment strategy'
        })
    
    return recommendations

