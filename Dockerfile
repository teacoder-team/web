FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_APP_URL=https://teacoder.ru
ARG NEXT_PUBLIC_API_URL=https://api.teacoder.ru
ARG NEXT_PUBLIC_SUPPORT_EMAIL=support@teacoder.ru
ARG NEXT_PUBLIC_OWNER_NAME
ARG NEXT_PUBLIC_OWNER_INN
ARG NEXT_PUBLIC_FPJS_API_KEY
ARG NEXT_PUBLIC_FPJS_ENDPOINT
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SUPPORT_EMAIL=$NEXT_PUBLIC_SUPPORT_EMAIL
ENV NEXT_PUBLIC_OWNER_NAME=$NEXT_PUBLIC_OWNER_NAME
ENV NEXT_PUBLIC_OWNER_INN=$NEXT_PUBLIC_OWNER_INN
ENV NEXT_PUBLIC_FPJS_API_KEY=$NEXT_PUBLIC_FPJS_API_KEY
ENV NEXT_PUBLIC_FPJS_ENDPOINT=$NEXT_PUBLIC_FPJS_ENDPOINT
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=$NEXT_PUBLIC_YANDEX_METRIKA_ID

RUN bun run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]