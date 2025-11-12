from pathlib import Path
from dotenv import load_dotenv
from decouple import config
from datetime import timedelta
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent

# Load the .env file.
load_dotenv(BASE_DIR / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-dev-key-change-in-production-12345')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = os.getenv(
	'DJANGO_ALLOWED_HOSTS',
	'localhost,127.0.0.1').split(',')

SIMPLE_JWT = {
	# How long before user needs to refresh (1 hour = secure + good UX).
	'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
	
	# How long before user must login again (7 days = convenient).
	'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
	
	# Generate new refresh token each time (prevents stolen token reuse).
	'ROTATE_REFRESH_TOKENS': True,
	
	# Mark old tokens as invalid in database (extra security).
	'BLACKLIST_AFTER_ROTATION': True,
	
	# Track when user was last active (for analytics).
	'UPDATE_LAST_LOGIN': True,
	
	# The SECRET_KEY is a random string that Simple JWT
	# (and Django itself) uses to sign and verify JWTs.
	'SIGNING_KEY': config('SECRET_KEY'),

	# Token must start with "Bearer" in HTTP header (industry standard).
	'AUTH_HEADER_TYPES': ('Bearer',)
}

# dj-rest-auth settings
REST_AUTH = {
	'USE_JWT': True,
	'JWT_AUTH_HTTPONLY': False,
	'JWT_AUTH_COOKIE': 'auth-token',
	'JWT_AUTH_REFRESH_COOKIE': 'refresh-token',
	'USER_DETAILS_SERIALIZER': 'users.serializers.UserSerializer',
	'REGISTER_SERIALIZER': 'users.serializers.CustomRegisterSerializer'
}

CORS_ALLOWED_ORIGINS = [
	"http://localhost:3000",
	"http://127.0.0.1:3000"
]

# Add any additional origins from environment.
env_origins = os.getenv("DJANGO_CORS_ALLOWED_ORIGINS", "")

if env_origins:
  CORS_ALLOWED_ORIGINS.extend(env_origins.split(","))

# Allow credentials for CORS
CORS_ALLOW_CREDENTIALS = True

# CSRF_TRUSTED_ORIGINS tells Django to trust
# CSRF tokens from this frontend.
CSRF_TRUSTED_ORIGINS = [
  "http://localhost:3000",
]

# Google OAuth Settings.
SOCIALACCOUNT_PROVIDERS = {
	'google': {
		'SCOPE': [
			'profile',
			'email'
		],
		'AUTH_PARAMS': {
			'access_type': 'online',
		},
		'APP': {
			'client_id': config('GOOGLE_OAUTH_CLIENT_ID'),
			'secret': config('GOOGLE_OAUTH_CLIENT_SECRET'),
			'key': ''
		}
	}
}

REST_FRAMEWORK = {
	# Checks the user's session cookie (created when you
	# log in through Django's authentication system).
	"DEFAULT_AUTHENTICATION_CLASSES": [
		'rest_framework.authentication.SessionAuthentication',
		'rest_framework_simplejwt.authentication.JWTAuthentication'
	],

	# IsAuthenticated
	# Only logged-in (authenticated) users can make API calls.
	# Any request without valid authentication will get a 403
	# Forbidden response.
	"DEFAULT_PERMISSION_CLASSES": [
		"rest_framework.permissions.IsAuthenticated",
	]
}

# Application definition.

INSTALLED_APPS = [
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',

	# Third party.
	'rest_framework',
	'rest_framework.authtoken',
	'rest_framework_simplejwt',
	'corsheaders',

	# Authentication.
	'django.contrib.sites',
	'allauth',
	'allauth.account',
	'allauth.socialaccount',
	'allauth.socialaccount.providers.google',
	'dj_rest_auth',
	'dj_rest_auth.registration',

	# Apps within the Django project.
	"users",
	"transactions",
	"investments",
	"notifications"
]

# Django-allauth settings
SITE_ID = 1  # Required for django-allauth

# Email settings
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_VERIFICATION = 'optional'
ACCOUNT_UNIQUE_EMAIL = True

# Social account settings
SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'
SOCIALACCOUNT_AUTO_SIGNUP = True

MIDDLEWARE = [
	'corsheaders.middleware.CorsMiddleware',
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
	'allauth.account.middleware.AccountMiddleware'
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages'
			]
		}
	}
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
	"default": {
		"ENGINE": "django.db.backends.postgresql",
		"NAME": "greenportfolio",
		"USER": "user",

		# Must match the same password in docker-compose.yml under
		# db -> POSTGRES_PASSWORD.
		"PASSWORD": "pass",

		# The container name from docker compose.
		"HOST": "greenportfolio_db",

		# "HOST": "localhost",

		"PORT": 5432
	}
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
	{
		'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
	}
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django allows you to override the default user model
# by providing a value for the AUTH_USER_MODEL setting
# that references a custom model:
AUTH_USER_MODEL = 'users.CustomUser'