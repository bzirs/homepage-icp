# 如果需要构建阶段（使用gulp）
FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm i -g pnpm
ENV SHELL=/bin/sh
COPY . .
RUN pnpm i
RUN pnpm build

# Caddy生产阶段
FROM caddy:alpine
WORKDIR /var/www/html
COPY --from=build /app/dist .
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
EXPOSE 443