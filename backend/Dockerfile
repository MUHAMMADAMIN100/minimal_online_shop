FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN echo "=== BEFORE BUILD ===" && ls -la
RUN npm run build
RUN echo "=== AFTER BUILD ===" && ls -la
RUN echo "=== DIST CONTENTS ===" && (ls -la dist || echo "NO DIST FOLDER")
RUN test -f dist/main.js || (echo "dist/main.js NOT FOUND!" && exit 1)

EXPOSE 8080

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx ts-node prisma/seed.ts && node dist/main.js"]
