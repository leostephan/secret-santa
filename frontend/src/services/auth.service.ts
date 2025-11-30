/**
 * Service d'authentification
 */

import { axiosInstance } from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';
import type {
  RegisterRequest,
  LoginRequest,
  AuthSuccessResponse,
  ProfileResponse,
} from '../types/api.types';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthSuccessResponse> => {
    const response = await axiosInstance.post<AuthSuccessResponse>(
      API_ENDPOINTS.auth.register,
      data
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthSuccessResponse> => {
    const response = await axiosInstance.post<AuthSuccessResponse>(
      API_ENDPOINTS.auth.login,
      data
    );
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await axiosInstance.get<ProfileResponse>(
      API_ENDPOINTS.auth.profile
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};
