from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.utils.dateparse import parse_date
from users.models import Account
from .models import Transaction
from .serializers import AccountSerializer, TransactionSerializer
import csv
import io
from datetime import datetime


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class AccountViewSet(viewsets.ModelViewSet):
  """
  Accounts are linked to users.
  Users can only see their own accounts.
  """

  serializer_class = AccountSerializer
  permission_classes = [permissions.IsAuthenticated]
  pagination_class = StandardResultsSetPagination

  # The get_queryset filter makes sure that only the accounts for
  # the logged-in user are returned.
  def get_queryset(self):
    return Account.objects.filter(user=self.request.user).order_by('-id')

  def perform_create(self, serializer):
    serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
  """
  Transactions belong to accounts.
  Users can only see transactions for accounts they own.
  Supports filtering by account, category, transaction_type, date range, and search.
  """

  serializer_class = TransactionSerializer
  permission_classes = [permissions.IsAuthenticated]
  pagination_class = StandardResultsSetPagination

  def get_queryset(self):
    queryset = Transaction.objects.filter(account__user=self.request.user)
    
    # Filter by account
    account_id = self.request.query_params.get('account_id')
    if account_id:
      queryset = queryset.filter(account_id=account_id)
    
    # Filter by category
    category = self.request.query_params.get('category')
    if category:
      queryset = queryset.filter(category__icontains=category)
    
    # Filter by transaction type
    transaction_type = self.request.query_params.get('transaction_type')
    if transaction_type:
      queryset = queryset.filter(transaction_type=transaction_type)
    
    # Filter by date range
    start_date = self.request.query_params.get('start_date')
    end_date = self.request.query_params.get('end_date')
    if start_date:
      start = parse_date(start_date)
      if start:
        queryset = queryset.filter(date__gte=start)
    if end_date:
      end = parse_date(end_date)
      if end:
        queryset = queryset.filter(date__lte=end)
    
    # Search by description
    search = self.request.query_params.get('search')
    if search:
      queryset = queryset.filter(description__icontains=search)
    
    # Order by date (newest first)
    return queryset.order_by('-date', '-id')

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
    
    Returns detailed validation errors with row numbers and field-level issues.
    """
    file = request.FILES.get('file')
    account_id = request.data.get('account')

    if not file or not account_id:
      return Response({
        'detail': 'Missing file or account',
        'errors': [{'field': 'file' if not file else 'account', 'message': 'Required field is missing'}]
      }, status=status.HTTP_400_BAD_REQUEST)

    # Check file size (max 5MB)
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    if file.size > MAX_FILE_SIZE:
      return Response({
        'detail': f'File too large. Maximum size is {MAX_FILE_SIZE / 1024 / 1024}MB',
        'errors': [{'field': 'file', 'message': f'File size ({file.size / 1024 / 1024:.2f}MB) exceeds maximum'}]
      }, status=status.HTTP_400_BAD_REQUEST)

    try:
      account = Account.objects.get(id=account_id, user=request.user)
    except Account.DoesNotExist:
      return Response({
        'detail': 'Account not found or you do not have access to it',
        'errors': [{'field': 'account', 'message': 'Invalid account ID'}]
      }, status=status.HTTP_404_NOT_FOUND)

    # Parse CSV
    created = 0
    errors = []

    try:
      text_stream = io.TextIOWrapper(file.file, encoding='utf-8')
      reader = csv.DictReader(text_stream)
      
      # Validate CSV headers
      required_headers = ['date', 'amount']
      if reader.fieldnames:
        missing_headers = [h for h in required_headers if h.lower() not in [f.lower() for f in reader.fieldnames]]
        if missing_headers:
          return Response({
            'detail': f'Missing required CSV headers: {", ".join(missing_headers)}',
            'errors': [{'field': 'file', 'message': f'CSV must contain columns: {", ".join(required_headers)}'}]
          }, status=status.HTTP_400_BAD_REQUEST)
    except UnicodeDecodeError as e:
      return Response({
        'detail': 'Invalid file encoding. Please use UTF-8 encoded CSV file',
        'errors': [{'field': 'file', 'message': str(e)}]
      }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
      return Response({
        'detail': f'Invalid CSV file: {e}',
        'errors': [{'field': 'file', 'message': str(e)}]
      }, status=status.HTTP_400_BAD_REQUEST)

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
      row_errors = []
      
      # Get and validate date
      date_str = row.get('date') or row.get('Date') or ''
      if not date_str:
        row_errors.append({'field': 'date', 'message': 'Date is required'})
      else:
        dt = parse_date(date_str.strip())
        if not dt:
          row_errors.append({'field': 'date', 'message': f'Invalid date format: {date_str}. Use YYYY-MM-DD, DD/MM/YYYY, or MM/DD/YYYY'})
      
      # Get and validate amount
      amount_str = row.get('amount') or row.get('Amount') or ''
      if not amount_str:
        row_errors.append({'field': 'amount', 'message': 'Amount is required'})
      else:
        try:
          amount = float(amount_str.strip())
          amount = abs(amount)  # Normalize
          if amount <= 0:
            row_errors.append({'field': 'amount', 'message': 'Amount must be greater than 0'})
        except (ValueError, TypeError):
          row_errors.append({'field': 'amount', 'message': f'Invalid amount: {amount_str}'})
          amount = None
      
      # Get and validate transaction type
      tx_type_raw = (row.get('transaction_type') or row.get('type') or '').strip().lower()
      if not tx_type_raw:
        row_errors.append({'field': 'transaction_type', 'message': 'Transaction type is required (credit or debit)'})
        tx_type = None
      elif tx_type_raw not in ('credit', 'debit'):
        row_errors.append({'field': 'transaction_type', 'message': f'Invalid transaction type: {tx_type_raw}. Must be "credit" or "debit"'})
        tx_type = None
      else:
        tx_type = tx_type_raw
      
      # If any validation errors, add to errors list and skip this row
      if row_errors:
        errors.append({
          'row': idx + 1,  # +1 because DictReader starts at 0, but we want to show row number in file
          'data': row,
          'errors': row_errors,
          'message': 'Validation failed'
        })
        continue
      
      # All validations passed, create transaction
      try:
        Transaction.objects.create(
          account=account,
          date=dt,
          amount=amount,
          description=(row.get('description') or row.get('Description') or '').strip(),
          category=(row.get('category') or row.get('Category') or None),
          transaction_type=tx_type
        )
        created += 1
      except Exception as e:
        errors.append({
          'row': idx + 1,
          'data': row,
          'errors': [{'field': 'general', 'message': f'Failed to create transaction: {str(e)}'}],
          'message': 'Database error'
        })

    return Response({'created': created, 'errors': errors}, status=status.HTTP_201_CREATED)