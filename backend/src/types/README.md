# Types Structure

Ce dossier contient tous les types TypeScript utilisés dans l'application, organisés par domaine.

## Structure

```
types/
├── index.ts         # Point d'entrée centralisé (export de tous les types)
├── domain.types.ts  # Entités de la base de données
├── auth.dto.ts      # DTOs pour l'authentification (+ types partagés)
└── session.dto.ts   # DTOs pour les sessions (+ types partagés)
```

## Utilisation

### ✅ Recommandé : Import depuis le point d'entrée

```typescript
import { User, Session, RegisterRequest, LoginResponse } from '../types';
```

### ✅ Import spécifique (si vous voulez être explicite sur l'origine)

```typescript
import { User } from '../types/domain.types';
import { RegisterRequest, LoginResponse, UserBasicInfo } from '../types/auth.dto';
import { SessionBasicInfo, ParticipantInfo } from '../types/session.dto';
```

## Catégories de types

### Domain Types (`domain.types.ts`)
Types qui représentent les entités de la base de données :
- `User` - Utilisateur de l'application
- `Session` - Session de Secret Santa
- `Participant` - Participant à une session

### Auth DTOs (`auth.dto.ts`)
Types pour les endpoints d'authentification :
- **Shared types** : `UserBasicInfo`, `AuthSuccessResponse`
- **Requests** : `RegisterRequest`, `LoginRequest`
- **Responses** : `RegisterResponse`, `LoginResponse`, `ProfileResponse`
- **Utilities** : `JWTPayload`

### Session DTOs (`session.dto.ts`)
Types pour les endpoints de gestion des sessions :
- **Requests** : `CreateSessionRequest`, `PickParticipantRequest`
- **Responses** : `CreateSessionResponse`, `SessionDetailResponse`, `PickParticipantResponse`

### Session DTOs (`session.dto.ts`)
Types pour les endpoints de gestion des sessions :
- **Shared types** : `SessionBasicInfo`, `ParticipantInfo`, `ParticipantDetailInfo`
- **Requests** : `CreateSessionRequest`, `PickParticipantRequest`
- **Responses** : `CreateSessionResponse`, `SessionDetailResponse`, `PickParticipantResponse`, `UserSessionsResponse`, `StartSessionResponse`, `GetAssignmentResponse`

### Legacy Types (`index.ts`)
Types maintenus pour la compatibilité avec le code existant (utilisés par les services/repositories) :
- `CreateUserDTO` - Utilisé par les repositories
- `CreateSessionDTO` - Utilisé par les services
- `LoginDTO` - Utilisé par le service auth

## Principes de conception

1. **DRY (Don't Repeat Yourself)** : Types partagés réutilisables (`UserBasicInfo`, `SessionBasicInfo`, etc.)
2. **Séparation des responsabilités** : Domain types (DB) ≠ DTOs (API)
3. **Single source of truth** : tsoa génère l'OpenAPI depuis ces types TypeScript
4. **Type-safety** : Validation automatique des requêtes/réponses
5. **Simplicité** : Import centralisé via `../types` pour la plupart des cas
