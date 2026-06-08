FROM node:24-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy semua file dan jalankan build
COPY . .
RUN npm run build

# --- Stage Produksi ---
FROM node:24-alpine AS runner
WORKDIR /app

# Atur environment untuk production
ENV NODE_ENV=production
ENV PORT=8080

# Copy file-file penting dari hasil build sebelumnya
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 8080

# Jalankan Next.js (pastikan di package.json bagian scripts ada "start": "next start")
CMD ["npm", "run", "start"]