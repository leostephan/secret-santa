import * as sessionRepository from '../repositories/session.repository';
import { CreateSessionDTO, Session, Participant } from '../types';
import { ERROR_MESSAGES } from '@secret-santa/common';

export const createSession = async (data: CreateSessionDTO): Promise<Session> => {
  // Plus besoin de valider le nombre de participants
  // Les participants rejoindront via le lien d'invitation
  return sessionRepository.create(data);
};

export const getSessionById = async (id: string): Promise<Session | null> => {
  return sessionRepository.findById(id);
};

export const getSessionByInviteCode = async (inviteCode: string): Promise<Session | null> => {
  return sessionRepository.findByInviteCode(inviteCode);
};

export const getUserSessions = async (userId: string): Promise<Session[]> => {
  // Récupérer les sessions créées par l'utilisateur
  const createdSessions = await sessionRepository.findByCreatorId(userId);

  // Récupérer les sessions où l'utilisateur est participant
  const participantSessions = await sessionRepository.findSessionsByParticipantUserId(userId);

  // Fusionner et dédupliquer les sessions (au cas où l'utilisateur serait créateur ET participant)
  const allSessions = [...createdSessions, ...participantSessions];
  const uniqueSessions = Array.from(
    new Map(allSessions.map(session => [session.id, session])).values()
  );

  // Trier par date de création décroissante
  return uniqueSessions.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const getParticipants = async (sessionId: string): Promise<Participant[]> => {
  return sessionRepository.getParticipants(sessionId);
};

export const joinSession = async (
  sessionId: string,
  name: string,
  email: string,
  userId?: string
): Promise<Participant> => {
  console.log('🔍 joinSession called with:', { sessionId, name, email, userId });

  // Vérifier que la session existe et est active
  const session = await sessionRepository.findById(sessionId);
  if (!session) {
    throw new Error(ERROR_MESSAGES.SESSION_NOT_FOUND);
  }

  if (!session.is_active) {
    throw new Error(ERROR_MESSAGES.SESSION_NOT_ACTIVE);
  }

  // Vérifier si le participant existe déjà
  const existingParticipant = await sessionRepository.findParticipantByEmail(sessionId, email);
  console.log('🔍 existingParticipant:', existingParticipant);

  if (existingParticipant) {
    // Participant existe déjà
    // Si un userId est fourni et que le participant n'a pas encore de user_id, on le lie
    if (userId && !existingParticipant.user_id) {
      console.log('🔗 Linking participant to user:', {
        participantId: existingParticipant.id,
        userId,
      });
      await sessionRepository.updateParticipantUserId(existingParticipant.id, userId);
    }

    // Récupérer le participant mis à jour
    const updatedParticipant = await sessionRepository.findParticipantByEmail(sessionId, email);
    console.log('✅ Returning updated participant:', updatedParticipant);
    return updatedParticipant || existingParticipant;
  }

  // Créer le nouveau participant avec le userId si fourni
  console.log('➕ Creating new participant with userId:', userId);
  const participant = await sessionRepository.createParticipantWithUserId(
    sessionId,
    name,
    email,
    userId
  );

  console.log('✅ Created participant:', participant);
  return participant;
};
export const getAvailableParticipants = async (sessionId: string): Promise<Participant[]> => {
  return sessionRepository.getAvailableParticipants(sessionId);
};

export const startSession = async (sessionId: string): Promise<void> => {
  const session = await sessionRepository.findById(sessionId);
  if (!session) {
    throw new Error(ERROR_MESSAGES.SESSION_NOT_FOUND);
  }

  if (session.is_started) {
    throw new Error(ERROR_MESSAGES.SESSION_ALREADY_STARTED);
  }

  await sessionRepository.startSession(sessionId);
};

export const updateSession = async (sessionId: string, name: string): Promise<Session> => {
  const session = await sessionRepository.findById(sessionId);
  if (!session) {
    throw new Error(ERROR_MESSAGES.SESSION_NOT_FOUND);
  }

  const updatedSession = await sessionRepository.updateSession(sessionId, name);
  if (!updatedSession) {
    throw new Error('Failed to update session');
  }

  return updatedSession;
};

export const pickParticipant = async (
  sessionId: string,
  name: string,
  pickerEmail: string
): Promise<Participant> => {
  // Vérifier que la session existe
  const session = await sessionRepository.findById(sessionId);
  if (!session) {
    throw new Error(ERROR_MESSAGES.SESSION_NOT_FOUND);
  }

  if (!session.is_active) {
    throw new Error(ERROR_MESSAGES.SESSION_NOT_ACTIVE);
  }

  // Vérifier si le participant existe, sinon le créer
  let picker = await sessionRepository.findParticipantByEmail(sessionId, pickerEmail);

  if (!picker) {
    // Créer le participant automatiquement
    picker = await sessionRepository.createParticipant(sessionId, name, pickerEmail);
  }

  // Lier le participant à un utilisateur s'il existe
  await sessionRepository.linkParticipantToUserIfExists(picker.id, pickerEmail);

  if (picker.has_picked) {
    throw new Error(ERROR_MESSAGES.ALREADY_PICKED);
  }

  // Récupérer les participants disponibles (pas encore assignés)
  const availableParticipants = await sessionRepository.getAvailableParticipants(sessionId);

  // Filtrer pour ne pas s'auto-assigner
  const selectableParticipants = availableParticipants.filter(p => p.id !== picker.id);

  if (selectableParticipants.length === 0) {
    throw new Error(ERROR_MESSAGES.NO_PARTICIPANTS_AVAILABLE);
  }

  // Sélectionner aléatoirement un participant
  const randomIndex = Math.floor(Math.random() * selectableParticipants.length);
  const assignedParticipant = selectableParticipants[randomIndex];

  // Assigner le participant
  await sessionRepository.assignParticipant(picker.id, assignedParticipant.id);

  return assignedParticipant;
};

export const getAssignment = async (
  sessionId: string,
  participantEmail: string
): Promise<Participant | null> => {
  const participants = await sessionRepository.getParticipants(sessionId);
  const participant = participants.find(p => p.email === participantEmail);

  if (!participant) {
    return null;
  }

  return sessionRepository.getAssignment(participant.id);
};

export const getMyAssignment = async (
  sessionId: string,
  userId: string
): Promise<Participant | null> => {
  // Trouver le participant lié à l'utilisateur dans cette session
  const participant = await sessionRepository.getParticipantByUserIdAndSessionId(userId, sessionId);

  if (!participant || !participant.has_picked) {
    return null;
  }

  // Récupérer son assignation
  return sessionRepository.getAssignment(participant.id);
};

export const deleteParticipant = async (participantId: string): Promise<void> => {
  await sessionRepository.deleteParticipant(participantId);
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await sessionRepository.deleteSession(sessionId);
};
