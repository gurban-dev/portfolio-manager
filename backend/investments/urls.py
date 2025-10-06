from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ESGScoreViewSet

router = DefaultRouter()
router.register(r'esg-scores', ESGScoreViewSet, basename='esgscore')

urlpatterns = [
  path('', include(router.urls)),
]