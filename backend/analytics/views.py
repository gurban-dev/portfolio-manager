from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.utils.dateparse import parse_date
from .serializers import PerformanceResponseSerializer, ESGResponseSerializer, RiskMetricsSerializer
from .services import compute_portfolio_time_series, compute_esg_series
from .risk_metrics import calculate_risk_metrics


def parse_range(request):
    today = datetime.utcnow().date()
    start_s = request.query_params.get('from')
    end_s = request.query_params.get('to')
    interval = request.query_params.get('interval', 'daily')

    start = parse_date(start_s) if start_s else (today - timedelta(days=30))
    end = parse_date(end_s) if end_s else today

    return start, end, interval


class PerformanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        start, end, interval = parse_range(request)
        ccy, series = compute_portfolio_time_series(request.user, start, end, interval)
        data = {'currency': ccy, 'series': series}
        serializer = PerformanceResponseSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


class ESGView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        start, end, interval = parse_range(request)
        series, total_co2, avg_rating = compute_esg_series(request.user, start, end, interval)
        data = {'series': series, 'total_co2_kg': total_co2, 'avg_rating': avg_rating}
        serializer = ESGResponseSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


class RiskView(APIView):
    print('backend/analytics/views.py RiskView')

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        print('request.user.is_authenticated:', request.user.is_authenticated)

        metrics = calculate_risk_metrics(request.user)
        serializer = RiskMetricsSerializer(data=metrics)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)