/**
 * Container d'inscription
 * Gère la logique métier et passe uniquement des scalaires au composant pur
 */

import { useNavigate } from 'react-router-dom';
import { RegisterPage } from '../pages/RegisterPage';
import { PageLayout } from '../components';
import { useRegister } from '../hooks/useAuth';
import { useAuth } from '../contexts/AuthContext';

export const RegisterContainer = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const registerMutation = useRegister();

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await registerMutation.mutateAsync({ email, password, name });
      login(response.token, response.user);
      navigate('/dashboard');
    } catch {
      // L'erreur est déjà gérée par React Query
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const errorMessage = registerMutation.error instanceof Error
    ? registerMutation.error.message
    : null;

  return (
    <PageLayout>
      <RegisterPage
        onRegister={handleRegister}
        onNavigateToLogin={handleNavigateToLogin}
        isLoading={registerMutation.isPending}
        error={errorMessage}
      />
    </PageLayout>
  );
};
