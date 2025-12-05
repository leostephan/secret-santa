/**
 * Constantes et enums partagés entre backend et frontend
 */

// Validation
export const VALIDATION = {
  MIN_PARTICIPANTS: 3,
  MAX_PARTICIPANTS: 100,
  MIN_SESSION_NAME_LENGTH: 3,
  MAX_SESSION_NAME_LENGTH: 100,
  MIN_PARTICIPANT_NAME_LENGTH: 2,
  MAX_PARTICIPANT_NAME_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 100,
  INVITE_CODE_LENGTH: 6,
} as const;

// Messages d'erreur
export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
  EMAIL_ALREADY_EXISTS: 'Un compte existe déjà avec cet email',
  WEAK_PASSWORD: `Le mot de passe doit contenir au moins ${VALIDATION.MIN_PASSWORD_LENGTH} caractères`,
  UNAUTHORIZED: 'Non autorisé',
  TOKEN_EXPIRED: 'Session expirée, veuillez vous reconnecter',

  // Session
  SESSION_NOT_FOUND: 'Session introuvable',
  SESSION_ALREADY_STARTED: 'Le tirage a déjà été effectué',
  SESSION_NOT_STARTED: 'La session n\'a pas encore été démarrée',
  SESSION_NOT_ACTIVE: 'Session inactive',
  MIN_PARTICIPANTS_REQUIRED: `Au moins ${VALIDATION.MIN_PARTICIPANTS} participants sont requis`,
  PARTICIPANT_NOT_FOUND: 'Participant introuvable',
  ALREADY_PICKED: 'Vous avez déjà effectué votre tirage',
  NO_PARTICIPANTS_AVAILABLE: 'Aucun participant disponible',
  CANNOT_SELF_ASSIGN: 'Impossible de se tirer soi-même',

  // Validation
  INVALID_EMAIL: 'Email invalide',
  FIELD_REQUIRED: 'Ce champ est requis',
  SESSION_NAME_TOO_SHORT: `Le nom de la session doit contenir au moins ${VALIDATION.MIN_SESSION_NAME_LENGTH} caractères`,
  SESSION_NAME_TOO_LONG: `Le nom de la session ne peut pas dépasser ${VALIDATION.MAX_SESSION_NAME_LENGTH} caractères`,
} as const;

// Messages de succès
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

// Statuts de session
export const SessionStatus = {
  PENDING: 'pending',
  STARTED: 'started',
  COMPLETED: 'completed',
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

// Routes API
export const API_ROUTES = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',

  // Sessions
  SESSIONS: '/sessions',
  SESSION_BY_ID: (id: string) => `/sessions/${id}`,
  SESSION_BY_INVITE: (code: string) => `/sessions/invite/${code}`,
  USER_SESSIONS: '/sessions/user/sessions',
  START_SESSION: (id: string) => `/sessions/${id}/start`,
  UPDATE_SESSION: (id: string) => `/sessions/${id}/update`,
  PICK_PARTICIPANT: (id: string) => `/sessions/${id}/pick`,
  DELETE_PARTICIPANT: (sessionId: string, participantId: string) =>
    `/sessions/${sessionId}/participants/${participantId}`,
  DELETE_SESSION: (id: string) => `/sessions/${id}`,
  GET_ASSIGNMENT: (id: string) => `/sessions/${id}/assignment`,
} as const;

// Configuration locale
export const LOCALE = {
  DATE_FORMAT: 'dd/MM/yyyy',
  DATE_TIME_FORMAT: 'dd/MM/yyyy HH:mm',
  TIMEZONE: 'Europe/Paris',
  LANGUAGE: 'fr-FR',
} as const;

// Emojis et icônes
export const EMOJI = {
  SANTA: '🎅',
  GIFT: '🎁',
  TREE: '🎄',
  STAR: '⭐',
  SNOWFLAKE: '❄️',
  BELL: '🔔',
  ENVELOPE: '📧',
  CHECK: '✅',
  CROSS: '❌',
  EDIT: '✏️',
  DELETE: '🗑️',
  LOADING: '⏳',
  SUCCESS: '✨',
  ERROR: '❗',
} as const;
