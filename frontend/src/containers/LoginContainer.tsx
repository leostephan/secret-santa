/**
 * Container de connexion
 * Gère la logique métier et passe uniquement des scalaires au composant pur
 */

import { useNavigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { PageLayout } from '../components';
import { useLogin } from '../hooks/useAuth';
import { useAuth } from '../contexts/AuthContext';

export const LoginContainer = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const loginMutation = useLogin();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      loginContext(response.token, response.user);
      navigate('/dashboard');
    } catch {
      // L'erreur est déjà gérée par React Query
    }
  };

  const handleNavigateToRegister = () => {
    navigate('/register');
  };

  const errorMessage = loginMutation.error instanceof Error
    ? loginMutation.error.message
    : null;

  return (
    <PageLayout>
      <LoginPage
        onLogin={handleLogin}
        onNavigateToRegister={handleNavigateToRegister}
        isLoading={loginMutation.isPending}
        error={errorMessage}
      />
    </PageLayout>
  );
};
