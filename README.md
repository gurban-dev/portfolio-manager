To launch the project:

docker compose up --build --remove-orphans

--remove-orphans removes the orphan containers.

Integrating Tailwind CSS with Next.js:

https://tailwindcss.com/docs/installation/framework-guides/nextjs

🧩 A. Authentication Workflow
1. User Registration

(Option 1) Email + Password:

User visits /auth/register

Frontend sends POST /api/users/register/

Backend:

Creates a User instance

Sends activation email (optional for real apps)

Response includes confirmation or JWT/session token.

(Option 2) Google OAuth2:

User clicks “Sign in with Google”

Redirects to Google consent screen → returns access token

Backend exchanges token → authenticates/creates user

Returns JWT/session to frontend.

2. Login

/auth/login

Email/password or Google OAuth redirect

Backend issues authentication cookie/session ID (for Django session-based auth)

Frontend stores session cookie automatically via withCredentials: true (if using Axios).

3. Logout

/auth/logout

Backend invalidates session or JWT.

Frontend clears user context and redirects to /auth/login.

💳 B. Account Management Workflow
1. Fetch User Accounts

Frontend: GET /accounts/

Backend: Returns all accounts owned by authenticated user.

2. Add New Account

Frontend: POST /accounts/ → sends form data { name, institution, balance, currency }

Backend:

Validates input

Creates new Account instance linked to the User

Returns updated account list.

3. Update Account

PUT /accounts/{id}/

Backend updates and returns new account data.

4. Delete Account

DELETE /accounts/{id}/

Backend deletes account and cascades related transactions.

💰 C. Transaction Workflow
1. View Transactions

Frontend: GET /transactions/?account_id=1

Backend: Filters by account and returns ordered list.

2. Add Transaction

Frontend: POST /transactions/
Example payload:

{
  "account": 1,
  "date": "2025-10-07",
  "amount": "120.00",
  "description": "Solar ETF Investment",
  "category": "Investment",
  "transaction_type": "debit"
}


Backend creates Transaction and triggers ESG analysis if applicable.

3. Edit Transaction

PUT /transactions/{id}/ — update details.

4. Delete Transaction

DELETE /transactions/{id}/

🌱 D. ESG Scoring Workflow
1. Automatic Scoring

When a new Transaction of type Investment is created:

Backend triggers a Celery task:

Queries ESG API / mock model for sustainability metrics.

Saves or updates an ESGScore instance linked to that transaction.

2. View ESG Scores

Frontend: GET /esg/

Backend returns:

[
  {
    "transaction": 34,
    "co2_impact": 12.5,
    "sustainability_rating": 8.9
  }
]


Displayed with ESGScoreBadge or in ESGScoreList.

🔔 E. Notification Workflow
1. Automatic Notification Trigger

Backend creates notifications for:

Large debit/credit transactions

Low balance

New ESG score available

Example signal in Django:

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Transaction, Notification

@receiver(post_save, sender=Transaction)
def notify_large_transaction(sender, instance, **kwargs):
  if abs(instance.amount) > 1000:
    Notification.objects.create(
      user=instance.account.user,
      message=f"Large transaction: {instance.amount} {instance.account.currency}",
    )

2. Fetch Unread Notifications

GET /notifications/?unread=true
→ used by NotificationBell

Backend filters notifications with is_read=False.

3. Mark as Read

PATCH /notifications/{id}/
{ "is_read": true }

📊 F. Dashboard Workflow

When user logs in and visits /dashboard:

Frontend fetches:

/accounts/

/transactions/?recent=true

/esg/

/notifications/?unread=true

Data populates dashboard cards, charts, badges, and notification count.

React state (or SWR hook) caches results for performance.

Optional Advanced Additions (For Hiring Value)
Feature	Why It’s Valuable
Google OAuth	Demonstrates real-world auth integration
WebSocket (Django Channels)	Real-time transaction + ESG updates
Celery + Redis	Asynchronous ESG scoring or notifications
Docker + Nginx reverse proxy	Production-grade deployment
Pytest + Jest tests	Quality + CI readiness
PostgreSQL	Industry-standard persistence
Vercel + Render or Fly.io	Modern, scalable hosting setup


Next.js App Router
app/
├─ page.tsx            → Route: `/` (homepage)
├─ dashboard/
│  ├─ page.tsx         → Route: `/dashboard`
│  ├─ settings/
│  │  └─ page.tsx      → Route: `/dashboard/settings`
├─ auth/
│  ├─ login/
│  │  └─ page.tsx      → Route: `/auth/login`
│  └─ register/
│     └─ page.tsx      → Route: `/auth/register`
├─ profile/
│  └─ [userId]/
│     └─ page.tsx      → Route: `/profile/:userId` (dynamic route)

Although not in frontend/app/page.tsx, the NotificationBell.tsx

component is rendered because it is part of the Navbar.tsx component

which is rendered in layout.tsx.