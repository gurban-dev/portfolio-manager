from django.db import models
from django.conf import settings


class Notification(models.Model):
  NOTIFICATION_TYPE_CHOICES = [
    ('info', 'Info'),
    ('warning', 'Warning'),
    ('transaction', 'Transaction'),
    ('esg', 'ESG Alert'),
  ]

  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='notifications'
  )

  title = models.CharField(max_length=255)

  message = models.TextField()

  notification_type = models.CharField(
    max_length=20,
    choices=NOTIFICATION_TYPE_CHOICES,
    default='info'
  )

  link = models.URLField(max_length=500, blank=True, null=True)
  is_read = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  read_at = models.DateTimeField(blank=True, null=True)

  class Meta:
    # Newest notifications first
    ordering = ['-created_at']

  def mark_as_read(self):
    self.is_read = True
    self.read_at = models.DateTimeField(auto_now=True)
    self.save()

  def __str__(self):
    return f"{self.user.email} - {self.title} ({'Read' if self.is_read else 'Unread'})"