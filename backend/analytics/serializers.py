from rest_framework import serializers


class TimePointSerializer(serializers.Serializer):
    date = serializers.DateField()
    value = serializers.FloatField()


class PerformanceResponseSerializer(serializers.Serializer):
    currency = serializers.CharField()
    series = TimePointSerializer(many=True)


class ESGPointSerializer(serializers.Serializer):
    date = serializers.DateField()
    co2_kg = serializers.FloatField()
    rating = serializers.FloatField()


class ESGResponseSerializer(serializers.Serializer):
    series = ESGPointSerializer(many=True)
    total_co2_kg = serializers.FloatField()
    avg_rating = serializers.FloatField()


class RiskMetricsSerializer(serializers.Serializer):
    risk_score = serializers.FloatField()
    expected_return = serializers.FloatField()
    sharpe_ratio = serializers.FloatField()
    volatility = serializers.FloatField()
