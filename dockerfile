FROM node:24.21.0-trixie-slim AS development

RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

WORKDIR /usr/app

COPY . .

RUN pnpm install

# Mail-ms es un microservicio RabbitMQ y no expone puerto HTTP.
