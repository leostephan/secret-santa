# Secret Santa API - Documentation

## 🎯 Vue d'ensemble

API REST pour gérer des sessions de Secret Santa avec authentification JWT, assignation aléatoire des participants et documentation OpenAPI automatique via **tsoa**.

**🚀 Documentation Swagger interactive :** http://localhost:3000/api-docs

## 🏗️ Architecture

- **Framework :** Express.js + TypeScript
- **Documentation :** tsoa (génération automatique OpenAPI depuis types TypeScript)
- **Base de données :** PostgreSQL
- **Authentification :** JWT
- **Validation :** Automatique via tsoa

## 📋 Base de données

Les tables suivantes ont été créées :
- `users` - Utilisateurs de l'application
- `sessions` - Sessions de Secret Santa
- `participants` - Participants à chaque session

## 🔐 Authentification

Toutes les routes nécessitant une authentification utilisent le header :
```
Authorization: Bearer <token>
```

### S'inscrire
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Réponse :**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Se connecter
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Obtenir son profil
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎅 Sessions Secret Santa

### Créer une session
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Secret Santa Noël 2025",
    "participants": [
      { "name": "Alice", "email": "alice@example.com" },
      { "name": "Bob", "email": "bob@example.com" },
      { "name": "Charlie", "email": "charlie@example.com" },
      { "name": "Diana", "email": "diana@example.com" }
    ]
  }'
```

**Réponse :**
```json
{
  "message": "Session created successfully",
  "session": {
    "id": "uuid",
    "name": "Secret Santa Noël 2025",
    "invite_code": "ABC12345",
    "is_active": true,
    "is_started": false,
    "created_at": "2025-11-30T..."
  }
}
```

### Obtenir ses sessions
```bash
curl -X GET http://localhost:3000/api/sessions/my-sessions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Obtenir une session par code d'invitation
```bash
curl -X GET http://localhost:3000/api/sessions/invite/ABC12345
```

### Obtenir une session par ID
```bash
curl -X GET http://localhost:3000/api/sessions/SESSION_ID
```

### Démarrer une session
```bash
curl -X POST http://localhost:3000/api/sessions/SESSION_ID/start \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Tirer un participant (roue des prénoms)
```bash
curl -X POST http://localhost:3000/api/sessions/SESSION_ID/pick \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com"
  }'
```

**Réponse :**
```json
{
  "message": "Participant picked successfully",
  "assigned_to": {
    "name": "Bob",
    "email": "bob@example.com"
  }
}
```

### Récupérer son assignation
```bash
curl -X GET "http://localhost:3000/api/sessions/SESSION_ID/assignment?email=alice@example.com"
```

## 🔄 Workflow complet

1. **Créateur** s'inscrit ou se connecte → obtient un `token`
2. **Créateur** crée une session avec la liste des participants → obtient un `invite_code`
3. **Créateur** partage le lien `http://votre-app.com/session/ABC12345`
4. **Participants** accèdent à la session via le code d'invitation
5. **Créateur** démarre la session
6. **Chaque participant** tire au sort un autre participant (ne peut pas se tirer lui-même)
7. **Participants restants** disparaissent en temps réel au fur et à mesure des tirages

## 🧪 Tests

### Vérifier que l'API fonctionne
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api
```

### Vérifier la base de données
```bash
docker-compose exec db psql -U secret_santa -d secret_santa_db

# Dans psql :
\dt  # Lister les tables
SELECT * FROM users;
SELECT * FROM sessions;
SELECT * FROM participants;
```

## 🔧 Commandes utiles

```bash
# Démarrer les containers
docker-compose up -d

# Voir les logs
docker-compose logs -f backend

# Arrêter les containers
docker-compose down

# Réinitialiser la base de données
docker-compose down -v
docker-compose up -d
docker-compose exec backend yarn init-db
```

## 📊 Structure de la base de données

### Table `users`
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR, nullable pour OAuth)
- `google_id` (VARCHAR, UNIQUE, nullable)
- `name` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### Table `sessions`
- `id` (UUID, PK)
- `name` (VARCHAR)
- `creator_id` (UUID, FK → users)
- `invite_code` (VARCHAR, UNIQUE)
- `is_active` (BOOLEAN)
- `is_started` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

### Table `participants`
- `id` (UUID, PK)
- `session_id` (UUID, FK → sessions)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `has_picked` (BOOLEAN)
- `assigned_to` (UUID, FK → participants, nullable)
- `created_at`, `updated_at` (TIMESTAMP)
- UNIQUE(`session_id`, `email`)

## 🚀 Prochaines étapes

- [ ] Implémenter WebSocket pour les mises à jour en temps réel
- [ ] Ajouter Google OAuth2
- [ ] Créer le frontend React
- [ ] Ajouter des tests unitaires et d'intégration
- [ ] Gestion des emails (envoi des liens d'invitation)
