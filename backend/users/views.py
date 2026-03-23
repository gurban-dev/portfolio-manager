from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import redirect
from django.core.mail import EmailMessage
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.conf import settings
from datetime import datetime
import secrets
import requests
import json
from .models import CustomUser
from .serializers import UserSerializer
from .models import EmailVerification
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
  def get_permissions(self):
    if self.action in ['list', 'create', 'destroy', 'update', 'partial_update']:
      permission_classes = [permissions.IsAdminUser]
    else:
      permission_classes = [permissions.IsAuthenticated]
    return [permission() for permission in permission_classes]

  # Only logged-in users with a valid session or token
  # can access the subsequent endpoint.
  @action(detail=False, methods=['get', 'patch'], permission_classes=[permissions.IsAuthenticated])
  def me(self, request):
    """Get or update current logged-in user profile"""
    if request.method == 'PATCH':
      serializer = self.get_serializer(request.user, data=request.data, partial=True)
      serializer.is_valid(raise_exception=True)
      serializer.save()
      return Response(serializer.data)
    else:
      serializer = self.get_serializer(request.user)
      return Response(serializer.data)

  @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
  def export_data(self, request):
    """
    Export all user data for GDPR compliance.
    Returns JSON with all user's accounts, transactions, ESG scores, and notifications.
    """
    from transactions.models import Transaction
    from investments.models import ESGScore
    from notifications.models import Notification
    from users.models import Account
    import json
    from django.http import HttpResponse
    
    user = request.user
    
    # Collect all user data
    data = {
      'user': {
        'email': user.email_address,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'preferred_currency': user.preferred_currency,
        'risk_tolerance': user.risk_tolerance,
        'esg_preference': user.esg_preference,
        'created_at': user.created_at.isoformat() if user.created_at else None,
      },
      'accounts': [
        {
          'id': acc.id,
          'name': acc.name,
          'institution': acc.institution,
          'balance': str(acc.balance),
          'currency': acc.currency,
        }
        for acc in Account.objects.filter(user=user)
      ],
      'transactions': [
        {
          'id': tx.id,
          'account_id': tx.account_id,
          'date': tx.date.isoformat(),
          'amount': str(tx.amount),
          'description': tx.description,
          'category': tx.category,
          'transaction_type': tx.transaction_type,
        }
        for tx in Transaction.objects.filter(account__user=user)
      ],
      'esg_scores': [
        {
          'transaction_id': esg.transaction_id,
          'co2_impact': esg.co2_impact,
          'sustainability_rating': esg.sustainability_rating,
        }
        for esg in ESGScore.objects.filter(transaction__account__user=user)
      ],
      'notifications': [
        {
          'id': notif.id,
          'title': notif.title,
          'message': notif.message,
          'notification_type': notif.notification_type,
          'is_read': notif.is_read,
          'created_at': notif.created_at.isoformat() if hasattr(notif, 'created_at') else None,
        }
        for notif in Notification.objects.filter(user=user)
      ],
      'export_date': datetime.now().isoformat(),
    }
    
    response = HttpResponse(
      json.dumps(data, indent=2),
      content_type='application/json'
    )
    response['Content-Disposition'] = f'attachment; filename="user-data-export-{user.id}.json"'
    return response

# Nonce
def generate_activation_token():
  # Generates a URL-safe, 32-byte random token
	# (can adjust length).
  return secrets.token_urlsafe(32)

def email_verification_code(user: CustomUser):
	"""
	Endpoint to send a verification email to the user.
	Expects JSON payload with 'emailAddress' key.
	"""

	# Generate and save the activation token.
	activation_token = EmailVerification.generate_token()

	EmailVerification.objects.create(user=user, token=activation_token)

	from django.conf import settings

	verification_url = (
		f"{settings.BACKEND_URL.rstrip('/')}/api/v1/users/verify-email/{activation_token}/"
	)

	if not user.email_address:
		logger.warning("Verification email request missing 'email' field.")

		return JsonResponse(
			{'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST
		)

	email_body = (
		f'<p style="font-size: 1.2rem;">'
		f'Click the link to confirm your FinSight sign up:<br>'
		f'<a href="{verification_url}">{verification_url}</a>'
		f'</p>'
	)

	# Compose the email.
	email = EmailMessage(
		subject='Confirm your FinSight account',
		body=email_body,
		from_email=settings.EMAIL_FROM_ADDRESS,
		to=[user.email_address],
		headers={'X-Custom-Header': 'FinSightVerification'}
	)

	# This way the font size of values assigned
	# to body can be larger.
	email.content_subtype = "html"

	# Send email in the background so the API request doesn't block.
	# For production-grade async workloads, use a task queue (Celery/RQ).
	import threading

	def _send_email():
		try:
			email.send(fail_silently=False)
			logger.info(f"Sent verification email to {user.email_address}")
		except Exception as exception:
			logger.error(
				f"Error sending verification email to {user.email_address}: {exception}",
				exc_info=True,
			)

	threading.Thread(target=_send_email, daemon=True).start()

	return JsonResponse(
		{'message': 'Verification email sending started'},
		status=status.HTTP_200_OK
	)

User = get_user_model()

# Optional access-token login is removed to reduce ambiguity.
# Frontend should use the auth-code flow via google_login_callback.

def get_or_create_user_from_google_access_token(access_token):
	# Use access_token to fetch Google profile
	response = requests.get(
		'https://www.googleapis.com/oauth2/v2/userinfo',
		headers={'Authorization': f'Bearer {access_token}'},
		timeout=10,
	)
	response.raise_for_status()

	profile = response.json()

	# Create or fetch user in your DB
	# CustomUser uses email_address, not email
	user, created = User.objects.get_or_create(
		email_address=profile['email'],
		defaults={
			'first_name': profile.get('given_name', ''),
			'last_name': profile.get('family_name', ''),
		}
	)

	return user, created

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
	"""
	Handle Google OAuth login with access token
	
	Expected payload:
	{
		"access_token": "google_access_token_here"
	}
	"""
	access_token = request.data.get('access_token')
	
	if not access_token:
		return Response(
			{'error': 'Access token is required'},
			status=status.HTTP_400_BAD_REQUEST
		)
	
	try:
		user, created = get_or_create_user_from_google_access_token(access_token)
		
		# If the user was just created, send the verification email.
		if created and not user.email_verified:
			email_verification_code(user)
		
		refresh = RefreshToken.for_user(user)
		
		return Response({
			'user': UserSerializer(user).data,
			'access': str(refresh.access_token),
			'refresh': str(refresh),
			'created': created
		}, status=status.HTTP_200_OK)
	except Exception as e:
		return Response(
			{'error': str(e)},
			status=status.HTTP_500_INTERNAL_SERVER_ERROR
		)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_callback(request):
	"""
	Alternative: Handle Google OAuth callback with authorization code
	
	Expected payload:
	{
		"code": "authorization_code_from_google"
	}
	"""
	code = request.data.get('code')
	
	if not code:
		return Response(
			{'error': 'Authorization code is required'},
			status=status.HTTP_400_BAD_REQUEST
		)

	try:
		# Exchange code for access token
		token_response = requests.post(
			'https://oauth2.googleapis.com/token',
			data={
				'code': code,
				'client_id': settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id'],
				'client_secret': settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['secret'],
				'redirect_uri': f"{settings.FRONTEND_URL}/auth/callback",
				'grant_type': 'authorization_code'
			},
			timeout=10,
		)

		if token_response.status_code != 200:
			return Response(
				{'error': 'Failed to exchange code for token'},
				status=status.HTTP_400_BAD_REQUEST
			)

		token_data = token_response.json()

		access_token = token_data.get('access_token')

		user, created = get_or_create_user_from_google_access_token(access_token)

		# If the user was just created, send the verification email.
		if created and not user.email_verified:
			email_verification_code(user)

		refresh = RefreshToken.for_user(user)

		# Return JWT tokens
		return Response({
			'user': UserSerializer(user).data,
			'access': str(refresh.access_token),
			'refresh': str(refresh),
			'created': created
		})
	except Exception as e:
		return Response(
			{'error': str(e)},
			status=status.HTTP_500_INTERNAL_SERVER_ERROR
		)

@csrf_exempt
def validate_google_token(request):
	if request.method == 'POST':
		try:
			data = json.loads(request.body)

			google_access_token = data.get('access_token')

			if not google_access_token:
				return JsonResponse({'detail': 'Access Token is missing.'}, status=400)

			return JsonResponse({'valid': True})
		except json.JSONDecodeError:
			return JsonResponse({'detail': 'Invalid JSON.'}, status=400)

	return JsonResponse({'detail': 'Method not allowed.'}, status=405)

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
	try:
		verification = EmailVerification.objects.get(token=token, is_used=False)
		user = verification.user
		user.email_verified = True
		user.save()
		verification.is_used = True
		verification.save()

		# Redirect to the frontend verification success route
		return redirect(f"{settings.FRONTEND_URL}/auth?verified=1")
	except EmailVerification.DoesNotExist:
		return Response({'error': 'Invalid or expired token'}, status=400)
