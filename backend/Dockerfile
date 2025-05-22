
FROM python:3.11-slim
WORKDIR /app

COPY ./backend /app
RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["gunicorn", "app.asgi:application", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]


FROM node:20-alpine
WORKDIR /app

COPY . .

ENV NEXT_PUBLIC_API_URL=https://vitalpath-backend.azurewebsites.net

RUN npm install && npm run build

EXPOSE 3000
CMD ["npm", "start"]


