/**
 * Service de gestion des sessions
 */

import { axiosInstance } from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  SessionDetailResponse,
  UserSessionsResponse,
  PickParticipantRequest,
  PickParticipantResponse,
  GetAssignmentResponse,
} from '../types/api.types';

export const sessionService = {
  createSession: async (data: CreateSessionRequest): Promise<CreateSessionResponse> => {
    const response = await axiosInstance.post<CreateSessionResponse>(
      API_ENDPOINTS.sessions.create,
      data
    );
    return response.data;
  },

  getUserSessions: async (): Promise<UserSessionsResponse> => {
    const response = await axiosInstance.get<UserSessionsResponse>(
      API_ENDPOINTS.sessions.list
    );
    return response.data;
  },

  getSessionById: async (id: string): Promise<SessionDetailResponse> => {
    const response = await axiosInstance.get<SessionDetailResponse>(
      API_ENDPOINTS.sessions.getById(id)
    );
    return response.data;
  },

  getSessionByInviteCode: async (code: string): Promise<SessionDetailResponse> => {
    const response = await axiosInstance.get<SessionDetailResponse>(
      API_ENDPOINTS.sessions.getByInviteCode(code)
    );
    return response.data;
  },

  startSession: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(
      API_ENDPOINTS.sessions.start(id)
    );
    return response.data;
  },

  joinSession: async (id: string, data: { name: string; email: string }): Promise<{ message: string; participant: any }> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.sessions.join(id),
      data
    );
    return response.data;
  },

  joinSessionAuthenticated: async (id: string): Promise<{ message: string; participant: any }> => {
    const response = await axiosInstance.post(
      `/sessions/${id}/join-authenticated`
    );
    return response.data;
  },

  updateSession: async (id: string, name: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(
      API_ENDPOINTS.sessions.update(id),
      { name }
    );
    return response.data;
  },

  pickParticipant: async (
    sessionId: string,
    data: PickParticipantRequest
  ): Promise<PickParticipantResponse> => {
    const response = await axiosInstance.post<PickParticipantResponse>(
      API_ENDPOINTS.sessions.pick(sessionId),
      data
    );
    return response.data;
  },

  getAssignment: async (
    sessionId: string,
    email: string
  ): Promise<GetAssignmentResponse> => {
    const response = await axiosInstance.get<GetAssignmentResponse>(
      `${API_ENDPOINTS.sessions.assignment(sessionId)}?email=${encodeURIComponent(email)}`
    );
    return response.data;
  },

  deleteParticipant: async (sessionId: string, participantId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(
      API_ENDPOINTS.sessions.deleteParticipant(sessionId, participantId)
    );
    return response.data;
  },

  deleteSession: async (sessionId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(
      API_ENDPOINTS.sessions.delete(sessionId)
    );
    return response.data;
  },
};
