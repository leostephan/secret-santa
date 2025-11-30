/**
 * React Query hooks pour l'authentification
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuth } from '../contexts/AuthContext';

export const useRegister = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
};

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return () => {
    authService.logout();
    logout();
    queryClient.clear();
  };
};

export const useProfile = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
