from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import redirect
from django.core.mail import EmailMessage
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from allauth.socialaccount.models import SocialToken, SocialAccount
from rest_framework import status
from django.http import JsonResponse
import secrets
import json
from .models import CustomUser
from .serializers import UserSerializer

import logging

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ModelViewSet):
  """
  API endpoint for managing users.

  Only admins can create, update, or delete users.

  Users can view their own profile.
  """

  queryset = CustomUser.objects.all()

  serializer_class = UserSerializer

  print('UserViewSet in backend/users/views.py line 21.')

  def get_permissions(self):
    if self.action in ['list', 'create', 'destroy', 'update', 'partial_update']:
      permission_classes = [permissions.IsAdminUser]
    else:
      permission_classes = [permissions.IsAuthenticated]
    return [permission() for permission in permission_classes]

  # Only logged-in users with a valid session or token
  # can access the subsequent endpoint.
  @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
  def me(self, request):
    """Get current logged-in user profile"""
    serializer = self.get_serializer(request.user)
    return Response(serializer.data)

# Nonce
def generate_activation_token():
  # Generates a URL-safe, 32-byte random token
	# (can adjust length).
  return secrets.token_urlsafe(32)

def send_verification_code(email_address: str):
	"""
	Endpoint to send a verification email to the user.
	Expects JSON payload with 'emailAddress' key.
	"""

	activation_token = str(generate_activation_token())

	try:
		# -Check if the following condition is even necessary.
		if not email_address:
			logger.warning("Verification email request missing 'email' field.")

			return JsonResponse(
				{'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST
			)

		email_body = (
			f'<p style="font-size: 1.2rem;">'
			f'Click on the subsequent link to confirm your Cognitia sign up: <br>'
			f'http://localhost:5173/confirm-email/{activation_token}'
			f'</p>'
		)

		# Compose the email.
		email = EmailMessage(
			subject='Sign in to Cognitia',
			body=email_body,
			from_email='team.cognitia.ai@gmail.com',
			to=[email_address],
			headers={'X-Custom-Header': 'CognitiaVerification'}
		)

		# This way the font size of values assigned
		# to body can be larger.
		email.content_subtype = "html"

		# Send the email asynchronously in production
		# (example: using Celery).
		email.send(fail_silently=False)

		# create_user_if_not_exists(email_address, activation_token)

		logger.info(f"Sent verification email to {email_address}")

		return JsonResponse(
			{'message': 'Verification email sent successfully'},
			status=status.HTTP_200_OK
		)
	except Exception as exception:
		logger.error(f"Error sending verification email: {exception}", exc_info=True)

		return JsonResponse(
			{'error': 'Internal server error. Please try again later.'},
			status=status.HTTP_500_INTERNAL_SERVER_ERROR
		)

@login_required
def google_login_callback(request):
	user = request.user

	social_accounts = SocialAccount.objects.filter(user=user)
	print("Social Account for user:", social_accounts)

	social_account = social_accounts.first()

	if not social_account:
		print("No social account for user:", user)
		return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')

	token = SocialToken.objects.filter(account=social_account, account__provider='google').first()

	if token:
		print('Google token found:', token.token)
		refresh = RefreshToken.for_user(user)
		access_token = str(refresh.access_token)
		return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}')
	else:
		print('No Google token found for user', user)
		return redirect(f'http://localhost:5173/login/callback/?error=NoGoogleToken')

@csrf_exempt
def validate_google_token(request):
	if request.method == 'POST':
		try:
			data = json.loads(request.body)
			google_access_token = data.get('access_token')
			print(google_access_token)

			if not google_access_token:
				return JsonResponse({'detail': 'Access Token is missing.'}, status=400)
			return JsonResponse({'valid': True})
		except json.JSONDecodeError:
			return JsonResponse({'detail': 'Invalid JSON.'}, status=400)
	return JsonResponse({'detail': 'Method not allowed.'}, status=405)