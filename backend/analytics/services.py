from datetime import date, timedelta
from collections import defaultdict
from django.utils import timezone
from django.db.models import Sum
from users.models import Account
from transactions.models import Transaction
from investments.models import ESGScore


MOCK_RATES = {
    'EUR': 1.0,
    'USD': 1.08,
    'GBP': 0.86,
    'NOK': 11.6,
    'SEK': 11.3,
    'CHF': 0.96,
}


def convert(amount: float, from_ccy: str, to_ccy: str) -> float:
    if from_ccy == to_ccy:
        return float(amount)
    # Convert via EUR as base
    eur = float(amount) / MOCK_RATES.get(from_ccy, 1.0)
    return eur * MOCK_RATES.get(to_ccy, 1.0)


def daterange(start_date, end_date, step_days=1):
    cur = start_date
    while cur <= end_date:
        yield cur
        cur += timedelta(days=step_days)


def normalize_interval(interval: str) -> str:
    return interval if interval in ('daily', 'weekly', 'monthly') else 'daily'


def floor_date(d: date, interval: str) -> date:
    if interval == 'weekly':
        return d - timedelta(days=d.weekday())
    if interval == 'monthly':
        return date(d.year, d.month, 1)
    return d


def compute_portfolio_time_series(user, start: date, end: date, interval: str):
    interval = normalize_interval(interval)

    # Seed with account balances converted to preferred currency
    preferred = getattr(user, 'preferred_currency', 'EUR')

    # Aggregate daily net flows per account
    tx = (
        Transaction.objects
        .filter(account__user=user, date__gte=start, date__lte=end)
        .values('date', 'account__currency')
        .annotate(total=Sum('amount'))
        .order_by('date')
    )

    buckets = defaultdict(float)

    # Start with sum of balances (as a naive starting value)
    accounts = Account.objects.filter(user=user)
    start_value = 0.0
    for acc in accounts:
        start_value += convert(float(acc.balance), acc.currency, preferred)

    # Build cumulative value over time by adding net flows
    cumulative = start_value

    # Map tx by date and currency for conversion
    tx_map = defaultdict(list)
    for row in tx:
        tx_map[row['date']].append((row['account__currency'], float(row['total'])))

    # Daily iteration to compute series
    cur = start
    out = []
    while cur <= end:
        for ccy, amt in tx_map.get(cur, []):
            cumulative += convert(amt, ccy, preferred)
        bucket = floor_date(cur, interval)
        buckets[bucket] = cumulative
        cur += timedelta(days=1)

    # Emit points in sorted order
    for k in sorted(buckets.keys()):
        out.append({'date': k, 'value': round(buckets[k], 2)})

    return preferred, out


def compute_esg_series(user, start: date, end: date, interval: str):
    interval = normalize_interval(interval)

    qs = (
        ESGScore.objects
        .filter(transaction__account__user=user,
                transaction__date__gte=start,
                transaction__date__lte=end)
        .select_related('transaction')
        .values('transaction__date')
        .annotate(co2=Sum('co2_impact'), rating=Sum('sustainability_rating'))
        .order_by('transaction__date')
    )

    # Note: sustainability_rating aggregated by sum then normalized by counts below
    # Simpler: fetch counts per day
    counts = (
        ESGScore.objects
        .filter(transaction__account__user=user,
                transaction__date__gte=start,
                transaction__date__lte=end)
        .values('transaction__date')
        .annotate(cnt=Sum(1))
    )
    count_map = {c['transaction__date']: c['cnt'] for c in counts}

    buckets = defaultdict(lambda: {'co2': 0.0, 'rating_sum': 0.0, 'count': 0})

    for row in qs:
        d = row['transaction__date']
        b = floor_date(d, interval)
        buckets[b]['co2'] += float(row['co2'] or 0.0)
        buckets[b]['rating_sum'] += float(row['rating'] or 0.0)
        buckets[b]['count'] += count_map.get(d, 1)

    series = []
    total_co2 = 0.0
    total_rating = 0.0
    total_count = 0
    for k in sorted(buckets.keys()):
        co2 = buckets[k]['co2']
        cnt = max(buckets[k]['count'], 1)
        avg_rating = buckets[k]['rating_sum'] / cnt
        total_co2 += co2
        total_rating += avg_rating * cnt
        total_count += cnt
        series.append({'date': k, 'co2_kg': round(co2, 2), 'rating': round(avg_rating, 2)})

    avg = round(total_rating / max(total_count, 1), 2) if total_count else 0.0

    return series, round(total_co2, 2), avg
