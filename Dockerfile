# --- Stage 1: build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
COPY openapi.yaml ./
RUN npm run build

# --- Stage 2: runtime ---
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/openapi.yaml ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
