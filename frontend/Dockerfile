FROM node:20-alpine
WORKDIR /app

COPY . .

ENV NEXT_PUBLIC_API_URL=https://vitalpath-backend.azurewebsites.net

RUN npm install && npm run build

EXPOSE 3000
CMD ["npm", "start"]


