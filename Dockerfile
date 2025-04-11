FROM node:slim-alpine AS builder

WORKDIR /app

ARG LIB_HUGEICONS
ENV LIB_HUGEICONS=${LIB_HUGEICONS}

COPY package.json package-lock.json ./
COPY .npmrc .npmrc

RUN npm ci

COPY . .

RUN npm run build

FROM node:slim-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

EXPOSE 3000

CMD ["npm", "start"]
