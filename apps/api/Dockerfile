FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
RUN npm install --workspace=apps/api --workspace=packages/database

COPY prisma/ ./prisma/
COPY tsconfig.base.json ./
COPY packages/database/ ./packages/database/
COPY apps/api/ ./apps/api/

RUN npm run db:generate
RUN npm run build --workspace=apps/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/index.js"]
