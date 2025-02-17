# Stage 1: Build the Next.js app
FROM node:16-alpine AS builder

WORKDIR /web

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:16-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3030

CMD ["npm", "start"]
