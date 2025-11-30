# Utiliser une image Node.js officielle
FROM node:22-alpine

# Créer le répertoire de travail
WORKDIR /app/backend

# Copier le package common en premier
COPY ./common /app/common

# Compiler le package common
WORKDIR /app/common
RUN yarn install --no-workspace && yarn build

# Retour au backend
WORKDIR /app/backend

# Copier les fichiers de dépendances du backend
COPY ./backend/package.json ./backend/yarn.lock ./

# Installer les dépendances (avec devDependencies pour nodemon)
RUN yarn install

# Rebuild le package common au cas où le lien s'est cassé
WORKDIR /app/common
RUN yarn build

# Retour au backend pour copier le code
WORKDIR /app/backend
COPY ./backend .

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["yarn", "dev"]
