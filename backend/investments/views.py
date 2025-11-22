from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ESGScore
from .serializers import ESGScoreSerializer
from .recommendations import get_esg_recommendations


class ESGScoreViewSet(viewsets.ModelViewSet):
  """
  ESG scores tied to transactions.
  Users can only see ESG scores for their own transactions.
  """
  serializer_class = ESGScoreSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    return ESGScore.objects.filter(transaction__account__user=self.request.user)

  def perform_create(self, serializer):
    transaction = serializer.validated_data['transaction']
    if transaction.account.user != self.request.user:
      from rest_framework.exceptions import PermissionDenied
      raise PermissionDenied("Cannot create ESG score for this transaction")
    serializer.save()

  @action(detail=False, methods=['get'])
  def recommendations(self, request):
    """
    Get ESG investment recommendations for the current user.
    """
    recommendations = get_esg_recommendations(request.user)
    return Response({'recommendations': recommendations})