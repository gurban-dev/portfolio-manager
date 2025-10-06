from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
  """
  API endpoint for managing users.
  Only admins can create, update, or delete users.
  Users can view their own profile.
  """
  queryset = User.objects.all()
  serializer_class = UserSerializer

  def get_permissions(self):
    if self.action in ['list', 'create', 'destroy', 'update', 'partial_update']:
      permission_classes = [permissions.IsAdminUser]
    else:
      permission_classes = [permissions.IsAuthenticated]
    return [permission() for permission in permission_classes]

  @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
  def me(self, request):
    """Get current logged-in user profile"""
    serializer = self.get_serializer(request.user)
    return Response(serializer.data)