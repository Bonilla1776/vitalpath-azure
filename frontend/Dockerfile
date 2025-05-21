NEXT_PUBLIC_API_URL=https://vitalpath-backend.azurewebsites.net

FROM node:20-alpine
WORKDIR /app

COPY ./frontend /app
RUN npm install && npm run build
ENV NEXT_PUBLIC_API_URL=https://vitalpath-backend.azurewebsites.net

EXPOSE 3000
CMD ["npm", "start"]
