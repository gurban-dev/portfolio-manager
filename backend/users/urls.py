from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
  path('', include(router.urls)),
  path("api/v1/auth/registration/", include("dj_rest_auth.registration.urls")),
  path("api/v1/auth/social/", include("allauth.socialaccount.urls")), 
]