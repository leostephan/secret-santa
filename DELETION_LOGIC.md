# Logique de suppression avec réattribution

## Suppression d'un participant

La suppression d'un participant est maintenant possible **à tout moment**, même après le démarrage de la session.

### Logique de réattribution

Quand un participant B est supprimé :

1. **Trouver la personne A** qui avait tiré B au sort (A → B)
2. **Trouver la personne C** que B avait tirée au sort (B → C)
3. **Réassigner A vers C** (A → C), pour maintenir la chaîne
4. **Supprimer B** de la base de données

### Exemple concret

Avant suppression :
```
Alice → Bob → Charlie → David → Alice
```

Si on supprime **Bob** :
```
Alice → Charlie → David → Alice
```

Alice est maintenant reliée directement à Charlie (qui était la cible de Bob).

### Cas particuliers

- Si personne n'avait tiré B (B n'a pas été assigné), la suppression se fait simplement
- Si B n'avait pas encore fait son tirage (assigned_to = NULL), seule la personne A est impactée et assigned_to devient NULL

## Suppression d'une session

La suppression d'une session est possible **à tout moment**, même après le démarrage.

- Supprime la session et tous les participants (CASCADE)
- Seul le créateur de la session peut la supprimer

## Sécurité

- **Authentification requise** : JWT obligatoire pour supprimer
- **Autorisation vérifiée** : Seul le créateur peut supprimer participants ou session
- **Transaction atomique** : La réattribution se fait dans une transaction SQL pour garantir la cohérence

# Liaison automatique utilisateur ↔ participant

## Fonctionnalité

Quand un utilisateur crée un compte avec un email qui a déjà été utilisé comme participant invité dans une ou plusieurs sessions :

1. **Lors de l'inscription** (`POST /auth/register`) :
   - Tous les participants avec cet email sont automatiquement liés au nouvel utilisateur
   - La colonne `user_id` est mise à jour dans la table `participants`

2. **Dans le dashboard** (`GET /sessions/user/sessions`) :
   - L'utilisateur voit **toutes** les sessions :
     - Les sessions qu'il a créées (où `creator_id = user.id`)
     - Les sessions où il est participant (où `participants.user_id = user.id`)

## Exemple de scénario

1. Alice crée une session et invite `bob@example.com` (Bob n'a pas encore de compte)
2. Bob reçoit le lien d'invitation et fait son tirage au sort avec son email
3. **Plus tard**, Bob décide de créer un compte avec `bob@example.com`
4. ✨ **Automatiquement** : Bob voit maintenant la session d'Alice dans son dashboard
5. Bob peut créer de nouvelles sessions, et voit toutes ses sessions (créées + participées)

## Implémentation technique

- **Base de données** : Colonne `user_id` ajoutée à la table `participants`
- **Service d'authentification** : Appel à `linkParticipantsToUser(email, userId)` lors du register
- **Service de session** : `getUserSessions()` fusionne les sessions créées + participées
- **Index** : Optimisation des requêtes avec index sur `participants.user_id` et `participants.email`

