from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom middleware to authenticate WebSocket connections using JWT tokens.
    Falls back to session-based authentication if JWT is not provided.
    """
    
    async def __call__(self, scope, receive, send):
        # Extract token from query string
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]
        
        user = None
        
        if token:
            try:
                # Validate JWT token
                UntypedToken(token)
                decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = decoded_data.get('user_id')
                
                if user_id:
                    user = await database_sync_to_async(User.objects.get)(id=user_id)
                    logger.info(f"WebSocket authenticated via JWT for user {user_id}")
            except (InvalidToken, TokenError, User.DoesNotExist, Exception) as e:
                logger.warning(f"JWT authentication failed: {e}")
                user = None
        
        # If JWT failed, try session-based auth (fallback)
        if not user:
            # Get session from scope (handled by AuthMiddlewareStack in ASGI)
            if 'user' in scope:
                user = scope.get('user')
                if user and user.is_authenticated:
                    logger.info(f"WebSocket authenticated via session for user {user.id}")
        
        # Set user in scope (AnonymousUser if not authenticated)
        scope['user'] = user if user and (not isinstance(user, AnonymousUser)) else AnonymousUser()
        
        return await super().__call__(scope, receive, send)
