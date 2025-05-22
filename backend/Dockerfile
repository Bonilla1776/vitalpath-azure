# backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app

COPY ./backend /app
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expose the port Django will run on
EXPOSE 8000

# Run Django ASGI app
CMD ["gunicorn", "app.asgi:application", "--bind", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker"]
