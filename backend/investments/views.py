from rest_framework import viewsets, permissions
from .models import ESGScore
from .serializers import ESGScoreSerializer


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