/**
 * Session DTOs - Types pour les endpoints de gestion des sessions
 */

// Shared types
export interface ParticipantInfo {
  name: string;
  email: string;
}

export interface SessionBasicInfo {
  id: string;
  name: string;
  invite_code: string;
  is_active: boolean;
  is_started: boolean;
  created_at: string; // ISO string for JSON compatibility
  is_creator?: boolean; // Indique si l'utilisateur connecté est le créateur
  participant_count?: number; // Nombre de participants dans la session
}

export interface ParticipantDetailInfo extends ParticipantInfo {
  id: string;
  has_picked: boolean;
}

// Requests
export interface CreateSessionRequest {
  name: string;
  participants?: Array<ParticipantInfo>; // Optionnel: la session peut être créée sans participants
}

export interface UpdateSessionRequest {
  name: string;
}

export interface JoinSessionRequest {
  name: string;
  email: string;
}

export interface PickParticipantRequest {
  name: string;
  email: string;
}

// Responses
export interface CreateSessionResponse {
  message: string;
  session: SessionBasicInfo;
}

export interface SessionDetailResponse {
  session: SessionBasicInfo;
  participants: Array<ParticipantDetailInfo>;
  is_creator: boolean; // Indique si l'utilisateur connecté est le créateur
  my_assignment?: ParticipantInfo; // L'assignation de l'utilisateur connecté s'il a déjà tiré
}

export interface PickParticipantResponse {
  message: string;
  assigned_to: ParticipantInfo;
}

export interface UserSessionsResponse {
  sessions: Array<SessionBasicInfo>;
}

export interface StartSessionResponse {
  message: string;
}

export interface GetAssignmentResponse {
  assigned_to: ParticipantInfo;
}

export interface JoinSessionResponse {
  message: string;
  participant: ParticipantDetailInfo;
}
