# backend/Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Correct relative path for your actual Django project
COPY ./django /app

RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["gunicorn", "app.asgi:application", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]

