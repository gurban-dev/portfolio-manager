from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, google_login, google_login_callback, verify_email

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
  path('', include(router.urls)),

  # Google OAuth
  path('api/auth/google/', google_login, name='google_login'),

  path('api/auth/google/callback/', google_login_callback, name='google_callback'),
  path('verify-email/<str:token>/', verify_email, name='verify-email'),
]