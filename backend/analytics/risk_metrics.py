from django.db.models import Avg, StdDev, Sum, Count
from django.utils import timezone
from datetime import timedelta
from transactions.models import Transaction
from investments.models import ESGScore
from users.models import Account
from .services import convert


def calculate_risk_metrics(user):
    """
    Calculate risk/reward metrics for a user's portfolio.
    Returns risk score, expected return, Sharpe ratio, and volatility.
    """
    # Get all transactions
    transactions = Transaction.objects.filter(account__user=user)
    
    if not transactions.exists():
        return {
            'risk_score': 5.0,
            'expected_return': 0.0,
            'sharpe_ratio': 0.0,
            'volatility': 0.0
        }
    
    # Calculate portfolio value over time (last 90 days)
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=90)
    
    recent_txs = transactions.filter(date__gte=start_date)
    
    # Calculate returns (simplified - based on transaction amounts)
    returns = []
    total_invested = 0
    total_value = 0
    
    accounts = Account.objects.filter(user=user)
    preferred_currency = getattr(user, 'preferred_currency', 'EUR')
    
    # Calculate current portfolio value
    for account in accounts:
        total_value += convert(float(account.balance), account.currency, preferred_currency)
    
    # Calculate invested amount (sum of debit transactions)
    debit_txs = transactions.filter(transaction_type='debit')
    for tx in debit_txs:
        total_invested += convert(float(tx.amount), tx.account.currency, preferred_currency)
    
    # Calculate expected return (simplified)
    if total_invested > 0:
        expected_return = ((total_value - total_invested) / total_invested) * 100
    else:
        expected_return = 0.0
    
    # Calculate volatility (standard deviation of returns)
    # Simplified: use transaction amount variance
    amounts = [float(tx.amount) for tx in recent_txs]
    if len(amounts) > 1:
        avg_amount = sum(amounts) / len(amounts)
        variance = sum((x - avg_amount) ** 2 for x in amounts) / len(amounts)
        volatility = (variance ** 0.5 / avg_amount * 100) if avg_amount > 0 else 0.0
    else:
        volatility = 0.0
    
    # Calculate risk score (0-10) based on volatility and ESG scores
    risk_score = min(10, max(0, volatility / 10))
    
    # Adjust risk based on ESG scores
    esg_scores = ESGScore.objects.filter(transaction__account__user=user)
    if esg_scores.exists():
        avg_esg = esg_scores.aggregate(Avg('sustainability_rating'))['sustainability_rating__avg'] or 7.0
        # Lower ESG = higher risk
        risk_score += (7.0 - avg_esg) * 0.3
        risk_score = min(10, max(0, risk_score))
    
    # Calculate Sharpe ratio (simplified)
    # Sharpe = (Return - Risk-free rate) / Volatility
    risk_free_rate = 2.0  # Assume 2% risk-free rate
    sharpe_ratio = ((expected_return - risk_free_rate) / volatility) if volatility > 0 else 0.0
    
    return {
        'risk_score': round(risk_score, 2),
        'expected_return': round(expected_return, 2),
        'sharpe_ratio': round(sharpe_ratio, 2),
        'volatility': round(volatility, 2)
    }

