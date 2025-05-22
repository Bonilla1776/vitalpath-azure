# backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app

COPY . /app
RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["gunicorn", "app.asgi:application", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]

