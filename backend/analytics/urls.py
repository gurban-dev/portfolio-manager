from django.urls import path
from .views import PerformanceView, ESGView, RiskView

urlpatterns = [
    path('performance/', PerformanceView.as_view(), name='analytics-performance'),
    path('esg/', ESGView.as_view(), name='analytics-esg'),
    path('risk/', RiskView.as_view(), name='analytics-risk'),
]
