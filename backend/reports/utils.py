from django.utils import timezone
from datetime import date


def generate_report_html(user, accounts, transactions, performance_series, 
                         esg_series, total_co2, avg_rating, risk_metrics, 
                         currency, start_date, end_date):
    """
    Generate HTML content for the monthly portfolio report.
    """
    total_balance = sum(float(acc.balance) for acc in accounts)
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Portfolio Report</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #333;
            }}
            h1 {{
                color: #10b981;
                border-bottom: 3px solid #10b981;
                padding-bottom: 10px;
            }}
            h2 {{
                color: #059669;
                margin-top: 30px;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }}
            th {{
                background-color: #10b981;
                color: white;
            }}
            .metric {{
                display: inline-block;
                margin: 10px 20px 10px 0;
                padding: 15px;
                background-color: #f0fdf4;
                border-left: 4px solid #10b981;
                min-width: 200px;
            }}
            .metric-label {{
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
            }}
            .metric-value {{
                font-size: 24px;
                font-weight: bold;
                color: #059669;
                margin-top: 5px;
            }}
            .footer {{
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #666;
            }}
        </style>
    </head>
    <body>
        <h1>Portfolio Monthly Report</h1>
        <p><strong>Generated:</strong> {timezone.now().strftime('%B %d, %Y')}</p>
        <p><strong>Period:</strong> {start_date.strftime('%B %d, %Y')} - {end_date.strftime('%B %d, %Y')}</p>
        
        <h2>Portfolio Overview</h2>
        <div class="metric">
            <div class="metric-label">Total Portfolio Value</div>
            <div class="metric-value">{currency} {total_balance:,.2f}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Number of Accounts</div>
            <div class="metric-value">{accounts.count()}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Transactions This Month</div>
            <div class="metric-value">{transactions.count()}</div>
        </div>
        
        <h2>Accounts</h2>
        <table>
            <thead>
                <tr>
                    <th>Account Name</th>
                    <th>Institution</th>
                    <th>Balance</th>
                    <th>Currency</th>
                </tr>
            </thead>
            <tbody>
    """
    
    for account in accounts:
        html += f"""
                <tr>
                    <td>{account.name}</td>
                    <td>{account.institution}</td>
                    <td>{account.balance:,.2f}</td>
                    <td>{account.currency}</td>
                </tr>
        """
    
    html += f"""
            </tbody>
        </table>
        
        <h2>ESG Impact</h2>
        <div class="metric">
            <div class="metric-label">Total CO₂ Impact</div>
            <div class="metric-value">{total_co2:.2f} kg</div>
        </div>
        <div class="metric">
            <div class="metric-label">Average ESG Rating</div>
            <div class="metric-value">{avg_rating:.2f} / 10</div>
        </div>
        
        <h2>Risk Analysis</h2>
        <div class="metric">
            <div class="metric-label">Risk Score</div>
            <div class="metric-value">{risk_metrics['risk_score']:.2f} / 10</div>
        </div>
        <div class="metric">
            <div class="metric-label">Expected Return</div>
            <div class="metric-value">{risk_metrics['expected_return']:.2f}%</div>
        </div>
        <div class="metric">
            <div class="metric-label">Sharpe Ratio</div>
            <div class="metric-value">{risk_metrics['sharpe_ratio']:.2f}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Volatility</div>
            <div class="metric-value">{risk_metrics['volatility']:.2f}%</div>
        </div>
        
        <h2>Recent Transactions</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
    """
    
    for tx in transactions[:20]:  # Show last 20 transactions
        html += f"""
                <tr>
                    <td>{tx.date.strftime('%Y-%m-%d')}</td>
                    <td>{tx.description}</td>
                    <td>{tx.amount:,.2f}</td>
                    <td>{tx.transaction_type}</td>
                    <td>{tx.category or '-'}</td>
                </tr>
        """
    
    html += """
            </tbody>
        </table>
        
        <div class="footer">
            <p>This report was generated automatically by FinSight Portfolio Manager.</p>
            <p>For questions or support, please contact your portfolio administrator.</p>
        </div>
    </body>
    </html>
    """
    
    return html

