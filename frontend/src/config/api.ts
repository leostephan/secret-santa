/**
 * API Configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    profile: '/auth/profile',
  },
  sessions: {
    create: '/sessions',
    list: '/sessions/user/sessions',
    getById: (id: string) => `/sessions/${id}`,
    getByInviteCode: (code: string) => `/sessions/invite/${code}`,
    start: (id: string) => `/sessions/${id}/start`,
    update: (id: string) => `/sessions/${id}/update`,
    join: (id: string) => `/sessions/${id}/join`,
    pick: (id: string) => `/sessions/${id}/pick`,
    assignment: (id: string) => `/sessions/${id}/assignment`,
    deleteParticipant: (sessionId: string, participantId: string) => `/sessions/${sessionId}/participants/${participantId}/delete`,
    delete: (id: string) => `/sessions/${id}/delete`,
  },
} as const;
