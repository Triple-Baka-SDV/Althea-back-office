# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Le lockfile est désynchronisé (@emnapi/* manquants côté pnpm), `npm ci`
# refuse de tourner — on retombe sur `npm install` qui régénère ce qu'il
# faut sans muter le lockfile dans l'image.
RUN npm install --no-audit --no-fund --progress=false

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev --no-audit --no-fund --progress=false \
  && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001 \
  && mkdir -p /app/.adminjs \
  && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/admin/login', (r) => { if (r.statusCode >= 500) throw new Error(r.statusCode) })" || exit 1

CMD ["node", "dist/index.js"]
