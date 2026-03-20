from django.apps import AppConfig


class UsersConfig(AppConfig):
	default_auto_field = 'django.db.models.BigAutoField'
	name = 'users'

	# The ready method ensures that the signal handlers are registered
	# when the app starts.
	def ready(self):
		import users.signals
