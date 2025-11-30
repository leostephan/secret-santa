# Backend REST API

Backend REST API pour l'application Secret Santa, développé avec Node.js, Express et TypeScript.

## 🚀 Installation

```bash
yarn install
```

## 📝 Configuration

Créer un fichier `.env` à la racine du dossier backend :

```bash
cp .env.example .env
```

Modifier les variables d'environnement selon vos besoins.

## 🏃 Lancer l'application

### Mode développement

```bash
yarn dev
```

Le serveur se lance sur `http://localhost:3000` avec rechargement automatique.

### Mode production

```bash
yarn build
yarn start
```

## 📚 Endpoints disponibles

### Health Check
- `GET /health` - Vérifier l'état du serveur

### API
- `GET /api` - Information sur l'API
- `GET /api/examples` - Récupérer tous les exemples
- `GET /api/examples/:id` - Récupérer un exemple par ID
- `POST /api/examples` - Créer un nouvel exemple
- `PUT /api/examples/:id` - Mettre à jour un exemple
- `DELETE /api/examples/:id` - Supprimer un exemple

## 🏗️ Structure du projet

```
backend/
├── src/
│   ├── controllers/      # Contrôleurs (logique des routes)
│   ├── services/         # Services (logique métier)
│   ├── routes/           # Définition des routes
│   ├── middleware/       # Middleware personnalisés
│   ├── types/            # Types TypeScript
│   └── index.ts          # Point d'entrée de l'application
├── dist/                 # Code compilé (généré)
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Scripts disponibles

- `yarn dev` - Lancer en mode développement
- `yarn build` - Compiler le TypeScript
- `yarn start` - Lancer en mode production
- `yarn lint` - Vérifier le code avec ESLint
- `yarn lint:fix` - Corriger automatiquement les erreurs ESLint
- `yarn format` - Formater le code avec Prettier
- `yarn format:check` - Vérifier le formatage du code

## 📦 Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Typage statique
- **Helmet** - Sécurité HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - Logger HTTP
- **dotenv** - Variables d'environnement
- **nodemon** - Rechargement automatique en développement
