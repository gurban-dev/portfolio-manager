from django.utils import timezone
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
  """
  Notifications are linked to users.
  Users can only view, update (mark read), and delete their own notifications.
  """
  serializer_class = NotificationSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    queryset = Notification.objects.filter(user=self.request.user)
    
    # Filter by unread status if requested
    unread = self.request.query_params.get('unread', None)

    if unread is not None:
      if unread.lower() == 'true':
        queryset = queryset.filter(is_read=False)
      elif unread.lower() == 'false':
        queryset = queryset.filter(is_read=True)
    
    return queryset

  def perform_create(self, serializer):
    serializer.save(user=self.request.user)

  @action(detail=True, methods=['post'])
  def mark_as_read(self, request, pk=None):
    """Custom action to mark a notification as read"""
    notification = self.get_object()
    notification.is_read = True
    notification.read_at = timezone.now()
    notification.save()
    return Response({'status': 'marked as read'})