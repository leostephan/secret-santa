# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copier et installer les dépendances communes
COPY common/package*.json ./common/
RUN cd common && npm install

# Copier le code source commun
COPY common/tsconfig.json ./common/
COPY common/src ./common/src

# Builder le package commun
RUN cd common && npm run build

# Copier et installer les dépendances du frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copier le code source du frontend
COPY frontend/src ./frontend/src
COPY frontend/index.html ./frontend/
COPY frontend/tsconfig*.json ./frontend/
COPY frontend/vite.config.ts ./frontend/
COPY frontend/eslint.config.js ./frontend/
COPY frontend/public ./frontend/public

# Builder le frontend
RUN cd frontend && npm run build

# Copier et installer les dépendances du serveur
COPY server/package*.json ./server/
RUN cd server && npm install

# Copier le code source du serveur
COPY server/tsconfig.json ./server/
COPY server/src ./server/src

# Build TypeScript du serveur
RUN cd server && npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app/server

# Copier uniquement le nécessaire depuis le builder
COPY --from=builder /app/frontend/dist /app/frontend/dist
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --production

EXPOSE 3002

CMD ["node", "dist/index.js"]
