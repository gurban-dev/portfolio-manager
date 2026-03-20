from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.http import HttpResponse
from django.utils import timezone
from datetime import timedelta
from xhtml2pdf import pisa
from io import BytesIO
from .utils import generate_report_html
from analytics.services import compute_portfolio_time_series, compute_esg_series
from analytics.risk_metrics import calculate_risk_metrics
from users.models import Account
from transactions.models import Transaction


class MonthlyReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Generate and return a PDF monthly report for the user's portfolio.
        """
        # Get date range for last month
        today = timezone.now().date()
        end_date = today
        start_date = today - timedelta(days=30)

        # Fetch data
        user = request.user
        accounts = Account.objects.filter(user=user)
        transactions = Transaction.objects.filter(
            account__user=user,
            date__gte=start_date,
            date__lte=end_date
        )

        # Get analytics
        currency, performance_series = compute_portfolio_time_series(
            user, start_date, end_date, 'daily'
        )
        esg_series, total_co2, avg_rating = compute_esg_series(
            user, start_date, end_date, 'daily'
        )
        risk_metrics = calculate_risk_metrics(user)

        # Generate HTML
        html_content = generate_report_html(
            user=user,
            accounts=accounts,
            transactions=transactions,
            performance_series=performance_series,
            esg_series=esg_series,
            total_co2=total_co2,
            avg_rating=avg_rating,
            risk_metrics=risk_metrics,
            currency=currency,
            start_date=start_date,
            end_date=end_date
        )

        # Convert HTML to PDF with error handling
        result = BytesIO()
        
        try:
            pdf = pisa.pisaDocument(BytesIO(html_content.encode("UTF-8")), result)
            
            if not pdf.err:
                response = HttpResponse(result.getvalue(), content_type='application/pdf')
                filename = f"portfolio-report-{start_date}-{end_date}.pdf"
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                response['Content-Length'] = len(result.getvalue())
                return response
            else:
                # Log PDF generation errors
                error_msg = f"PDF generation failed: {pdf.err}"
                import logging
                logger = logging.getLogger(__name__)
                logger.error(error_msg)
                
                return Response(
                    {'error': 'Failed to generate PDF. Please try again later.'},
                    status=500
                )
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"PDF generation exception: {str(e)}")
            
            return Response(
                {'error': f'An error occurred while generating the PDF: {str(e)}'},
                status=500
            )

