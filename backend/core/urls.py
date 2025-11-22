from django.contrib import admin
from django.urls import path, include
from users.views import google_login, google_login_callback

urlpatterns = [
  path('admin/', admin.site.urls),

  # Standard authentication (dj-rest-auth)
  path('api/auth/', include('dj_rest_auth.urls')),
  path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

  # Google OAuth
  path('api/auth/google/', google_login, name='google_login'),
  path('api/auth/google/callback/', google_login_callback, name='google_callback'),

  # Social auth URLs (django-allauth)
  path('accounts/', include('allauth.urls')),

  # Versioned API endpoints
  path('api/v1/users/', include('users.urls')),
  # transactions.urls registers both 'accounts' and 'transactions' routers
  path('api/v1/', include('transactions.urls')),
  path('api/v1/investments/', include('investments.urls')),
  path('api/v1/notifications/', include('notifications.urls')),
  path('api/v1/analytics/', include('analytics.urls')),
  path('api/v1/reports/', include('reports.urls')),
]