# FinSight Deployment Guide

## Production checklist

- Set `DJANGO_SETTINGS_MODULE=core.settings_prod` for the backend.
- Populate [backend/.env.example](/home/deniz/fullstack/portfolio_manager/backend/.env.example) and [frontend/.env.example](/home/deniz/fullstack/portfolio_manager/frontend/.env.example) with real secrets and URLs.
- Use HTTPS in front of both apps and set `DJANGO_ALLOWED_HOSTS`, `DJANGO_CORS_ALLOWED_ORIGINS`, and `DJANGO_CSRF_TRUSTED_ORIGINS` to your real domains.
- Provision PostgreSQL and Redis with backups enabled.
- Rotate `SECRET_KEY`, Google OAuth credentials, and database passwords outside the repo.

## Container deployment

Build and run with:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

The backend container now runs migrations and `collectstatic` automatically before starting Daphne. Health endpoints are exposed at `/health/` on the backend and `/` on the frontend.

## CI/CD

The GitHub Actions workflow in [ci.yml](/home/deniz/fullstack/portfolio_manager/.github/workflows/ci.yml) now:

- runs Django migrations and tests against PostgreSQL and Redis
- runs frontend linting and TypeScript checks
- builds both Docker images

## Recommended next infrastructure step

Put the stack behind a reverse proxy or load balancer:

- AWS: ALB + ECS/EC2 + RDS + ElastiCache
- GCP: HTTPS Load Balancer + Cloud Run/GCE + Cloud SQL + Memorystore

Terminate TLS at the proxy and forward `X-Forwarded-Proto=https` to Django.
