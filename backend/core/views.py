from django.conf import settings
from django.db import connections
from django.db.utils import OperationalError
from django.http import JsonResponse


def health_check(request):
    database_ok = True
    try:
        connections["default"].cursor()
    except OperationalError:
        database_ok = False

    status_code = 200 if database_ok else 503
    return JsonResponse(
        {
            "status": "ok" if database_ok else "degraded",
            "environment": getattr(settings, "ENVIRONMENT", "development"),
            "database": "ok" if database_ok else "unavailable",
        },
        status=status_code,
    )
