from rest_framework import viewsets, permissions
from users.models import Account
from .models import Transaction
from .serializers import AccountSerializer, TransactionSerializer


class AccountViewSet(viewsets.ModelViewSet):
  """
  Accounts are linked to users.
  Users can only see their own accounts.
  """
  serializer_class = AccountSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    return Account.objects.filter(user=self.request.user)

  def perform_create(self, serializer):
    serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
  """
  Transactions belong to accounts.
  Users can only see transactions for accounts they own.
  """
  serializer_class = TransactionSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    return Transaction.objects.filter(account__user=self.request.user)

  def perform_create(self, serializer):
    # Ensure transaction is linked to an account belonging to current user
    account = serializer.validated_data['account']
    if account.user != self.request.user:
      from rest_framework.exceptions import PermissionDenied
      raise PermissionDenied("Cannot create transaction for this account")
    serializer.save()