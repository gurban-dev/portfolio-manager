from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
	# (?P<user_id>\d+) will capture a numeric user_id from the
	# URL and pass it to your consumer as
	# self.scope['url_route']['kwargs']['user_id'].
	re_path(r'ws/notifications/(?P<user_id>\d+)/$', consumers.NotificationConsumer.as_asgi()),
]