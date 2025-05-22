FROM python:3.11-slim
WORKDIR /app

COPY ./backend /app
RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:8000", "--workers", "4"]