from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings
from django.utils import timezone


class CustomUserManager(BaseUserManager):
  def create_user(
    self, email_address, password=None, first_name=None, last_name=None
  ):
    if not email_address:
      raise ValueError('An email address must be set')

    email_address = self.normalize_email(email_address)

    user = self.model(
      email_address=email_address,
      first_name=first_name,
      last_name=last_name
    )

    if password:
      user.set_password(password)
    else:
      # For users without passwords (Google sign-in).
      user.set_unusable_password()

    user.save(using=self._db)

    return user

  def create_superuser(
    self, email_address, password, first_name=None, last_name=None
  ):
    user = self.create_user(
      email_address=email_address,
      password=password,
      first_name=first_name,
      last_name=last_name
    )

    user.is_superuser = True
    user.is_staff = True
    user.save(using=self._db)

    return user


class CustomUser(AbstractUser):
  email_address = models.EmailField(unique=True)

  role_choices = [('user', 'User'), ('admin', 'Admin')]

  role = models.CharField(max_length=10, choices=role_choices, default='user')

  preferred_currency = models.CharField(max_length=3, default='EUR')

  USERNAME_FIELD = 'email_address'
  REQUIRED_FIELDS = ['first_name', 'last_name']

  objects = CustomUserManager()

  def __str__(self):
    return self.email_address


class ActivationToken(models.Model):
	# OneToOneField links token to a single user.
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL, on_delete=models.CASCADE
	)

	# The unique activation token.
	activation_token = models.CharField(max_length=64, unique=True)

	created_at = models.DateTimeField(auto_now_add=True)

	# expires_at defines token expiration time.
	expires_at = models.DateTimeField()

	# used flags whether token has been consumed.
	used = models.BooleanField(default=False)

	def is_expired(self):
		return timezone.now() > self.expires_at

	def mark_used(self):
		self.used = True
		self.save()


class Account(models.Model):
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='accounts'
  )

  name = models.CharField(max_length=100)
  institution = models.CharField(max_length=100)
  balance = models.DecimalField(max_digits=15, decimal_places=2)
  currency = models.CharField(max_length=3, default='EUR')