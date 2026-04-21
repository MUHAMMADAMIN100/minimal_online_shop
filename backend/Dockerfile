FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build
RUN test -f dist/main.js || (echo "BUILD FAILED: dist/main.js not produced" && ls -la dist && exit 1)

EXPOSE 8080

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx ts-node prisma/seed.ts && node dist/main.js"]
