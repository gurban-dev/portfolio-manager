from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from users.models import Account
from .models import Transaction
from .serializers import AccountSerializer, TransactionSerializer
import csv
import io
from datetime import datetime


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

  @action(detail=False, methods=['post'], parser_classes=[MultiPartParser])
  def import_csv(self, request):
    """
    Upload a CSV file of transactions and create them for a given account.
    Expected multipart/form-data with:
      - file: CSV file
      - account: account ID (must belong to current user)
    CSV headers: date, amount, description, category, transaction_type
    """
    file = request.FILES.get('file')
    account_id = request.data.get('account')

    if not file or not account_id:
      return Response({'detail': 'Missing file or account'}, status=status.HTTP_400_BAD_REQUEST)

    try:
      account = Account.objects.get(id=account_id, user=request.user)
    except Account.DoesNotExist:
      return Response({'detail': 'Account not found'}, status=status.HTTP_404_NOT_FOUND)

    # Parse CSV
    created = 0
    errors = []

    try:
      text_stream = io.TextIOWrapper(file.file, encoding='utf-8')
      reader = csv.DictReader(text_stream)
    except Exception as e:
      return Response({'detail': f'Invalid CSV file: {e}'}, status=status.HTTP_400_BAD_REQUEST)

    def parse_date(s: str):
      for fmt in ('%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y'):
        try:
          return datetime.strptime(s.strip(), fmt).date()
        except Exception:
          continue
      # Fallback to fromisoformat
      try:
        return datetime.fromisoformat(s.strip()).date()
      except Exception:
        return None

    for idx, row in enumerate(reader, start=1):
      try:
        date_str = row.get('date') or row.get('Date')
        amount_str = row.get('amount') or row.get('Amount')
        description = row.get('description') or row.get('Description') or ''
        category = row.get('category') or row.get('Category') or None
        tx_type = (row.get('transaction_type') or row.get('type') or '').strip().lower()

        if not date_str or not amount_str or tx_type not in ('credit','debit'):
          raise ValueError('Missing required fields or invalid transaction_type')

        dt = parse_date(date_str)
        if not dt:
          raise ValueError(f'Invalid date: {date_str}')

        amount = float(amount_str)
        # Normalize
        amount = abs(amount)

        Transaction.objects.create(
          account=account,
          date=dt,
          amount=amount,
          description=description,
          category=category,
          transaction_type=tx_type
        )
        created += 1
      except Exception as e:
        errors.append({'row': idx, 'error': str(e)})

    return Response({'created': created, 'errors': errors}, status=status.HTTP_201_CREATED)