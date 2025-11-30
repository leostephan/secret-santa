/**
 * Constantes locales backend (workaround pour l'import du package common)
 */

export const SUCCESS_MESSAGES = {
  // Auth
  REGISTER_SUCCESS: 'Compte créé avec succès',
  LOGIN_SUCCESS: 'Connexion réussie',

  // Session
  SESSION_CREATED: 'Session créée avec succès',
  SESSION_UPDATED: 'Session mise à jour avec succès',
  SESSION_DELETED: 'Session supprimée avec succès',
  SESSION_STARTED: 'Tirage au sort lancé avec succès',
  SESSION_JOINED: 'Vous avez rejoint la session avec succès',
  PICK_SUCCESS: 'Tirage effectué avec succès',
  PARTICIPANT_DELETED: 'Participant supprimé avec succès',
  INVITE_LINK_COPIED: 'Lien copié dans le presse-papiers !',
} as const;
