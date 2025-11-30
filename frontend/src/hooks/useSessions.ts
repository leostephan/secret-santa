/**
 * React Query hooks pour les sessions
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../services/session.service';
import type { PickParticipantRequest } from '../types/api.types';

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionService.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useUserSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: sessionService.getUserSessions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSession = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => sessionService.getSessionById(sessionId!),
    enabled: !!sessionId,
  });
};

export const useSessionByInviteCode = (inviteCode: string | undefined) => {
  return useQuery({
    queryKey: ['session', 'invite', inviteCode],
    queryFn: () => sessionService.getSessionByInviteCode(inviteCode!),
    enabled: !!inviteCode && inviteCode.length > 0,
  });
};

export const useStartSession = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sessionService.startSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useJoinSession = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string }) => sessionService.joinSession(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useJoinSessionAuthenticated = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sessionService.joinSessionAuthenticated(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const usePickParticipant = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PickParticipantRequest) =>
      sessionService.pickParticipant(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
};

export const useAssignment = (sessionId: string) => {
  return useMutation({
    mutationFn: (email: string) => sessionService.getAssignment(sessionId, email),
  });
};

export const useUpdateSession = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => sessionService.updateSession(sessionId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useDeleteParticipant = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participantId: string) => sessionService.deleteParticipant(sessionId, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionService.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};
