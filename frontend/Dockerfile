# frontend/Dockerfile - OPTIMIZED VERSION
FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies with frozen lockfile for speed
RUN npm ci --only=production --ignore-scripts

# Copy source code
COPY . .

# Set production environment
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://vitalpath-backend.azurewebsites.net

# Build with optimizations
RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "start"]


