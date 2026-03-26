# Stage 1: Dependencies
FROM node:20.15.0-alpine3.19 AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN npm install -g pnpm && pnpm install
RUN npx prisma generate

# Stage 2: Build
FROM node:20.15.0-alpine3.19 AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY src ./src

RUN pnpm run build

# Stage 3: Production
FROM node:20.15.0-alpine3.19 AS production

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .
COPY .env ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
