FROM node:18.12.1-slim AS builder

RUN npm i -g pnpm

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
RUN pnpm install

COPY . .

RUN pnpm run build

# 実行用イメージ
FROM node:18.12.1-slim

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5173

CMD ["node", "./build"]
