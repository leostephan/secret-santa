# Secret Santa - Docker Setup

## 🐳 Démarrage avec Docker

### Prérequis
- Docker
- Docker Compose

### Lancer l'application

```bash
# Depuis la racine du projet
docker-compose up
```

L'application sera accessible sur :
- Backend API : http://localhost:3000
- PostgreSQL : localhost:5432

### Commandes utiles

```bash
# Démarrer en arrière-plan
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime la BDD)
docker-compose down -v

# Reconstruire les images
docker-compose build

# Redémarrer un service spécifique
docker-compose restart backend

# Exécuter une commande dans un conteneur
docker-compose exec backend yarn lint
docker-compose exec backend yarn build

# Accéder au shell d'un conteneur
docker-compose exec backend sh
docker-compose exec db psql -U secret_santa -d secret_santa_db
```

### Configuration

Les variables d'environnement sont définies dans :
- `docker-compose.yml` pour les conteneurs
- `backend/.env` pour le développement local

### Connexion à la base de données

**Depuis l'host (votre machine) :**
```
Host: localhost
Port: 5432
Database: secret_santa_db
User: secret_santa
Password: secret_santa_password
```

**Depuis le conteneur backend :**
```
DATABASE_URL=postgresql://secret_santa:secret_santa_password@db:5432/secret_santa_db
```

## 🔧 Développement

### Mode développement local (sans Docker)

```bash
cd backend
yarn install
yarn dev
```

### Mode développement avec Docker

Les fichiers sont synchronisés en temps réel grâce aux volumes Docker. Les modifications du code déclenchent un rechargement automatique via nodemon.

## 📦 Structure

```
secret-santa/
├── docker-compose.yml          # Configuration Docker Compose
├── backend/
│   ├── Dockerfile             # Image Docker du backend
│   ├── .dockerignore          # Fichiers à ignorer par Docker
│   ├── .env                   # Variables d'environnement
│   └── src/                   # Code source
└── README.md
```
