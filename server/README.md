# Secret Santa - Frontend Server

Serveur Express simple pour servir le build du frontend en production.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Production

```bash
# Build TypeScript
npm run build

# Démarrer le serveur
npm start
```

Le serveur écoute par défaut sur le port 3000. Vous pouvez le changer avec la variable d'environnement `PORT`.

## Prérequis

Assurez-vous que le frontend a été buildé :

```bash
cd ../frontend
npm run build
```
