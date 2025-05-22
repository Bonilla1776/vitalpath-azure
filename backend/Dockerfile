# backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app

COPY ./backend /app
RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["gunicorn", "django_project_name.asgi:application", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]


