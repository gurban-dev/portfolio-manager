from django.contrib import admin
from django.urls import path, include
from django.urls import include

urlpatterns = [
  path('admin/', admin.site.urls),
  
  # Standard authentication (dj-rest-auth)
  path('api/auth/', include('dj_rest_auth.urls')),
  path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
  
  # Social auth URLs (django-allauth)
  path('accounts/', include('allauth.urls')),
  
  # Your app URLs
  path('api/v1/users/', include('users.urls')),
  path('api/v1/accounts/', include('transactions.urls')),
  path('api/v1/transactions/', include('transactions.urls')),
  path('api/v1/investments/', include('investments.urls')),
  path('api/v1/notifications/', include('notifications.urls')),

  path('', include('users.urls')),
  path('', include('transactions.urls')),
  path('', include('notifications.urls')),
  path('', include('investments.urls'))
]