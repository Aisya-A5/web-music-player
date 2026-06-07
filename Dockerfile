# --- Stage 1: Build ---
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js (sekarang aman karena sudah pakai force-dynamic)
RUN npm run build

# --- Stage 2: Production ---
FROM node:24-alpine

WORKDIR /app

# Salin package.json dan pasang dependensi production saja agar image ringan
COPY package*.json ./
RUN npm install --omit=dev

# Salin hasil build Next.js dan file publik yang dibutuhkan
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Setup entrypoint untuk memindahkan secret env dari Cloud Run ke aplikasi saat runtime
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'if [ -d "/secrets" ] && [ -f "/secrets/.env" ]; then' >> /app/entrypoint.sh && \
    echo '  cp /secrets/.env /app/.env' >> /app/entrypoint.sh && \
    echo '  echo "Loaded environment from mounted secret"' >> /app/entrypoint.sh && \
    echo 'fi' >> /app/entrypoint.sh && \
    echo 'exec npm run start -- -p 8080' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]