from django.contrib import admin
from django.urls import path, include

urlpatterns = [
  path('admin/', admin.site.urls),
  path('api/v1/users/', include('users.urls')),
  path('api/v1/accounts/', include('transactions.urls')),
  path('api/v1/transactions/', include('transactions.urls')),
  path('api/v1/investments/', include('investments.urls')),
  path('api/v1/notifications/', include('notifications.urls')),
]