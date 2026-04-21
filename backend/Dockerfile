FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

RUN ls -la dist

EXPOSE 8080

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx ts-node prisma/seed.ts && node dist/main.js"]
