FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'if [ -d "/secrets" ] && [ -f "/secrets/.env" ]; then' >> /app/entrypoint.sh && \
    echo '  cp /secrets/.env /app/.env' >> /app/entrypoint.sh && \
    echo '  echo "Loaded environment from mounted secret"' >> /app/entrypoint.sh && \
    echo 'fi' >> /app/entrypoint.sh && \
    echo 'exec node src/server.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh && \
    chown node:node /app/entrypoint.sh

RUN npm run build

FROM node:24-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/build ./build

EXPOSE 8080

CMD ["serve", "-s", "build", "-l", "8080"]