FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements/base.txt

CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]